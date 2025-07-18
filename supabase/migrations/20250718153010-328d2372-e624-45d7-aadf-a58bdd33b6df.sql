-- Create custom types
CREATE TYPE sms_session_status AS ENUM ('pending', 'active', 'completed', 'failed', 'expired');
CREATE TYPE delivery_status AS ENUM ('pending', 'completed', 'failed', 'expired');
CREATE TYPE server_type AS ENUM ('server_1', 'server_2');
CREATE TYPE transaction_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('paystack', 'flutterwave', 'bank_transfer', 'admin_credit');
CREATE TYPE log_event_type AS ENUM ('sms_request', 'credit_deduction', 'credit_addition', 'payment_processed', 'user_suspended', 'session_expired', 'admin_action');
CREATE TYPE setting_type AS ENUM ('string', 'boolean', 'integer', 'json');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    balance INTEGER DEFAULT 0,
    is_admin BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    price_per_use INTEGER NOT NULL,
    available BOOLEAN DEFAULT TRUE,
    assigned_server server_type DEFAULT 'server_1',
    is_global BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sms_sessions table
CREATE TABLE public.sms_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id),
    phone_number TEXT,
    server server_type NOT NULL,
    status sms_session_status DEFAULT 'pending',
    delivery_status delivery_status DEFAULT 'pending',
    request_id TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    received_at TIMESTAMP WITH TIME ZONE,
    sms_count INTEGER DEFAULT 0,
    messages JSONB DEFAULT '[]',
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE public.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    payment_method payment_method NOT NULL,
    reference TEXT UNIQUE,
    status transaction_status DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logs table
CREATE TABLE public.logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type log_event_type NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    description TEXT,
    ip_address INET,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create settings table
CREATE TABLE public.settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    type setting_type DEFAULT 'string',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_id AND is_admin = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for services table
CREATE POLICY "Everyone can view available services" ON public.services
    FOR SELECT USING (available = TRUE);

CREATE POLICY "Admins can manage services" ON public.services
    FOR ALL USING (public.is_admin(auth.uid()));

-- RLS Policies for sms_sessions table
CREATE POLICY "Users can view their own sessions" ON public.sms_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON public.sms_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.sms_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all sessions" ON public.sms_sessions
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all sessions" ON public.sms_sessions
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for transactions table
CREATE POLICY "Users can view their own transactions" ON public.transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own transactions" ON public.transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" ON public.transactions
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update all transactions" ON public.transactions
    FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for logs table (admin only)
CREATE POLICY "Admins can view all logs" ON public.logs
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "System can insert logs" ON public.logs
    FOR INSERT WITH CHECK (TRUE);

-- RLS Policies for settings table (admin only)
CREATE POLICY "Admins can manage settings" ON public.settings
    FOR ALL USING (public.is_admin(auth.uid()));

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, balance, is_admin)
    VALUES (NEW.id, NEW.email, 0, FALSE);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON public.services
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sms_sessions_updated_at
    BEFORE UPDATE ON public.sms_sessions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON public.transactions
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_settings_updated_at
    BEFORE UPDATE ON public.settings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Create logging function
CREATE OR REPLACE FUNCTION public.log_event(
    p_event_type log_event_type,
    p_user_id UUID,
    p_description TEXT,
    p_ip_address INET DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO public.logs (event_type, user_id, description, ip_address, metadata)
    VALUES (p_event_type, p_user_id, p_description, p_ip_address, p_metadata)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default services
INSERT INTO public.services (name, price_per_use, assigned_server) VALUES
    ('Google', 50, 'server_1'),
    ('WhatsApp', 75, 'server_1'),
    ('Telegram', 45, 'server_2'),
    ('Facebook', 60, 'server_2'),
    ('Instagram', 70, 'server_1'),
    ('Twitter', 55, 'server_2');

-- Insert default settings
INSERT INTO public.settings (key, value, type, description) VALUES
    ('default_server', 'server_1', 'string', 'Default server for new sessions'),
    ('sms_price', '50', 'integer', 'Default price per SMS'),
    ('enable_refunds', 'true', 'boolean', 'Enable automatic refunds for failed sessions'),
    ('max_retry_attempts', '3', 'integer', 'Maximum retry attempts for failed SMS requests'),
    ('session_timeout_minutes', '30', 'integer', 'Session timeout in minutes'),
    ('system_banner', '', 'string', 'System-wide banner message');

-- Create storage bucket for user uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('user-uploads', 'user-uploads', false);

-- Create storage policies
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'user-uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-uploads' AND 
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Admins can view all user files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'user-uploads' AND 
        public.is_admin(auth.uid())
    );

-- Enable realtime for relevant tables
ALTER TABLE public.sms_sessions REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
ALTER TABLE public.users REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.sms_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
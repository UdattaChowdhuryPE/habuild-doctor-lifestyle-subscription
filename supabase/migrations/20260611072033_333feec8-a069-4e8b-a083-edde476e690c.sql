CREATE TABLE public.prescriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name text NOT NULL,
    patient_mobile text NOT NULL,
    habits text[] NOT NULL DEFAULT '{}',
    doctor_name text NOT NULL DEFAULT 'Dr. Udatta Chowdhury',
    status text NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.prescriptions TO anon;
GRANT SELECT, INSERT ON public.prescriptions TO authenticated;
GRANT ALL ON public.prescriptions TO service_role;

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anyone to create prescriptions" ON public.prescriptions
    FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anyone to view prescriptions" ON public.prescriptions
    FOR SELECT TO anon USING (true);

CREATE POLICY "Allow authenticated to create prescriptions" ON public.prescriptions
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated to view prescriptions" ON public.prescriptions
    FOR SELECT TO authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_prescriptions_updated_at
    BEFORE UPDATE ON public.prescriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
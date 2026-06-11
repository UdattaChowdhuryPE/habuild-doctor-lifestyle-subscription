ALTER TABLE public.prescriptions ADD COLUMN invite_link text;

COMMENT ON COLUMN public.prescriptions.invite_link IS 'Doctor personal invite link for the 14-Day Free Yoga Program';
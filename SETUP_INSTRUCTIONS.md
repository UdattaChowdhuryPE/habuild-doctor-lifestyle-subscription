# Feature 1: Phone OTP Auth - Setup Instructions

## Step 1: Enable Phone Authentication in Supabase

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Phone** provider
4. Configure Twilio:
   - Go to **Phone** provider settings
   - Select "Twilio" as the SMS provider
   - Enter your Twilio Account SID and Auth Token
   - Click "Save"

## Step 2: Run Database Migrations

Run the SQL migrations from `sql/migrations/01_create_auth_tables.sql` in your Supabase SQL editor:

1. Go to your Supabase project → **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `sql/migrations/01_create_auth_tables.sql`
4. Click **Run**

This will create:

- `profiles` table for doctor information
- `patients` table for patient records
- `habit_templates` table for saved habit templates
- Add `doctor_id` and `patient_id` columns to `prescriptions` table
- Set up Row Level Security (RLS) policies

## Step 3: Test the Auth Flow

1. Run `npm run dev` to start the development server
2. You should be redirected to `/login`
3. Enter a phone number (e.g., `9876543210`)
4. Click "Send OTP"
5. You'll receive an OTP via SMS (from Twilio)
6. Enter the OTP to sign in
7. You'll be redirected to `/profile-setup`
8. Enter your full name and optional referral link
9. Click "Save Profile"
10. You should now see the `/send` page

## Step 4: Update Supabase Types

After creating the tables, regenerate the Supabase types:

```bash
npx supabase gen types typescript --project-id xofhxanzceplvlxvrfcw > src/integrations/supabase/types.ts
```

(Replace `xofhxanzceplvlxvrfcw` with your actual Supabase project ID from `.env`)

## Troubleshooting

### "Missing phone provider" error

- Make sure phone auth is enabled in Supabase settings
- Verify Twilio credentials are correct

### OTP not received

- Check Twilio logs for SMS delivery errors
- Ensure phone number format is correct (10 digits)

### "Profile not found" after login

- The profile is created on first save in the profile-setup page
- Make sure you complete the profile setup flow

## Current Status

✅ Phone OTP auth flow implemented
✅ Login route created
✅ Profile setup route created
✅ Dashboard and navigation created
✅ Placeholder routes for Patients, History, Analytics

⏳ Next features to implement:

- Patient profiles management
- Prescription history list
- Custom habit templates
- Analytics dashboard

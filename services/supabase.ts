import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hqsnzkittcmgdicgosdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhxc256a2l0dGNtZ2RpY2dvc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDA1MjksImV4cCI6MjA4NTI3NjUyOX0.gaZEO1bDygn_0JB_SfZKcjwWEsdyQOYYEqOGNswwrr8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

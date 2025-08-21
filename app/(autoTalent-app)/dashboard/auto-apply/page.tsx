"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLoading } from "@/context/LoadingContext";
import { createClient } from "@/utils/supabase/client";
import { Edit, Trash2, Eye, Calendar, User, FileText, Plus, Coins, Settings } from "lucide-react";

export default function AutoApplyDashboard() {
  const { setIsLoading } = useLoading();
  const router = useRouter();
  const [submittedForms, setSubmittedForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);
  const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [credits, setCredits] = useState(0);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(false);
  const [loadingAutoApply, setLoadingAutoApply] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  // Initialize Supabase client
  useEffect(() => {
    const initSupabase = async () => {
      const client = await createClient();
      setSupabaseClient(client);
    };
    initSupabase();
  }, []);

  // Load user credits and Auto-Apply status
  const loadUserData = async () => {
    if (!supabaseClient) return;
    setLoadingCredits(true);
    setLoadingAutoApply(true);
    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }
      
      // Check if user has a user record
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('credits, "Auto-Apply"')
        .eq('id', user.id)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Error fetching user data:', userError);
        return;
      }
      
      setCredits(userData?.credits || 0);
      setAutoApplyEnabled(userData?.["Auto-Apply"] || false);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoadingCredits(false);
      setLoadingAutoApply(false);
    }
  };

  // Add test credits (10 credits)
  const addTestCredits = async () => {
    if (!supabaseClient) return;
    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }

      // First, try to get existing user record
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return;
      }

      // Upsert user record with credits
      const { error: upsertError } = await supabaseClient
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          username: existingUser?.username || null,
          plan_sub: existingUser?.plan_sub || null,
          "Auto-Apply": existingUser?.["Auto-Apply"] || null,
          last_auto_applied: existingUser?.last_auto_applied || null,
          credits: (existingUser?.credits || 0) + 10,
          created_at: existingUser?.created_at || new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error('Error adding credits:', upsertError);
        return;
      }

      setCredits(prev => prev + 10);
      alert('Added 10 test credits!');
    } catch (error) {
      console.error('Error adding test credits:', error);
      alert('Failed to add test credits');
    }
  };

  // Activate Auto-Apply (consumes 10 credits)
  const activateAutoApply = async () => {
    if (!supabaseClient) return;
    
    if (credits < 10) {
      alert('You need at least 10 credits to activate Auto-Apply!');
      return;
    }

    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }

      // First, try to get existing user record
      const { data: existingUser, error: fetchError } = await supabaseClient
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching user:', fetchError);
        return;
      }

      // Update user record: consume 10 credits and set Auto-Apply to true
      const { error: updateError } = await supabaseClient
        .from('users')
        .upsert({
          id: user.id,
          email: user.email,
          username: existingUser?.username || null,
          plan_sub: existingUser?.plan_sub || null,
          "Auto-Apply": true,
          last_auto_applied: existingUser?.last_auto_applied || null,
          credits: (existingUser?.credits || 0) - 10,
          created_at: existingUser?.created_at || new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (updateError) {
        console.error('Error activating Auto-Apply:', updateError);
        alert('Failed to activate Auto-Apply');
        return;
      }

      setCredits(prev => prev - 10);
      setAutoApplyEnabled(true);
      alert('Auto-Apply activated successfully! 10 credits consumed.');
    } catch (error) {
      console.error('Error activating Auto-Apply:', error);
      alert('Failed to activate Auto-Apply');
    }
  };

  // Load submitted forms
  const loadSubmittedForms = async () => {
    if (!supabaseClient) return;
    setLoading(true);
    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }
      const { data: forms, error } = await supabaseClient
        .from('auto_apply_configs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching forms:', error);
        return;
      }
      setSubmittedForms(forms || []);
    } catch (error) {
      console.error('Error loading forms:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load applied jobs
  const loadAppliedJobs = async () => {
    if (!supabaseClient) return;
    setLoadingJobs(true);
    try {
      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      if (authError || !user) {
        console.error('Auth error:', authError);
        return;
      }
      const { data: jobs, error } = await supabaseClient
        .from('applied_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });
      if (error) {
        console.error('Error fetching applied jobs:', error);
        return;
      }
      setAppliedJobs(jobs || []);
    } catch (error) {
      console.error('Error loading applied jobs:', error);
    } finally {
      setLoadingJobs(false);
    }
  };

  useEffect(() => {
    if (supabaseClient) {
      loadSubmittedForms();
      loadAppliedJobs();
      loadUserData();
    }
  }, [supabaseClient]);

  const handleEditForm = (formId: string) => {
    router.push(`/dashboard/auto-apply/form?edit=${formId}`);
  };

  const handleDeleteForm = async (formId: string) => {
    if (!supabaseClient) return;
    if (confirm('Are you sure you want to delete this configuration?')) {
      try {
        const { error } = await supabaseClient
          .from('auto_apply_configs')
          .delete()
          .eq('form_id', formId);
        if (error) {
          console.error('Error deleting form:', error);
          return;
        }
        // Reload forms
        loadSubmittedForms();
      } catch (error) {
        console.error('Error deleting form:', error);
      }
    }
  };

  // Check if user can create new form (only one allowed)
  const canCreateNewForm = submittedForms.length === 0;

  // Placeholder data
  const jobsProgress = 0;
  const jobsTotal = 10;
  const lastUpdate = "1min ago";
  const status = "Pending";

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-2 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle className="text-2xl mt-2">{status}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Jobs Progress</CardDescription>
              <CardTitle className="text-2xl mt-2">{jobsProgress}/{jobsTotal}</CardTitle>
              <div className="text-xs text-muted-foreground mt-1">0% Completed</div>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Available Credits</CardDescription>
              <CardTitle className="text-2xl mt-2 flex items-center justify-center gap-2">
                <Coins className="w-5 h-5" />
                {loadingCredits ? '...' : credits}
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {credits >= 10 ? 'Ready to apply' : 'Need 10 credits to apply'}
              </div>
            </CardHeader>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <CardDescription>Auto-Apply Status</CardDescription>
              <CardTitle className="text-2xl mt-2 flex items-center justify-center gap-2">
                <Settings className="w-5 h-5" />
                {loadingAutoApply ? '...' : (autoApplyEnabled ? 'Active' : 'Inactive')}
              </CardTitle>
              <div className="text-xs text-muted-foreground mt-1">
                {autoApplyEnabled ? 'Auto-applying enabled' : 'Manual mode'}
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Test Credits and Auto-Apply Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Test Functions</CardTitle>
            <CardDescription>Development tools for testing credits and Auto-Apply functionality</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={addTestCredits} variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add 10 Test Credits
            </Button>
            <Button 
              onClick={activateAutoApply} 
              variant="default" 
              className="w-full"
              disabled={credits < 10 || autoApplyEnabled || loadingAutoApply}
            >
              <Settings className="w-4 h-4 mr-2" />
              {autoApplyEnabled ? 'Auto-Apply Already Active' : 'Activate Auto-Apply (10 credits)'}
            </Button>
            {credits < 10 && !autoApplyEnabled && (
              <p className="text-xs text-red-600 text-center">
                Need at least 10 credits to activate Auto-Apply
              </p>
            )}
            {autoApplyEnabled && (
              <p className="text-xs text-green-600 text-center">
                ✓ Auto-Apply is already active
              </p>
            )}
          </CardContent>
        </Card>

        {/* Submitted Forms */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base font-medium">Submitted Configurations</CardTitle>
              <Button 
                onClick={() => router.push("/dashboard/auto-apply/form")} 
                size="sm"
                disabled={!canCreateNewForm}
              >
                + New Configuration
              </Button>
            </div>
            {!canCreateNewForm && (
              <CardDescription className="text-red-600">
                You can only have one configuration at a time. Please delete the existing one to create a new one.
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Loading configurations...</p>
              </div>
            ) : submittedForms.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="font-semibold text-lg mb-2">No Configurations Yet</h3>
                <p className="text-gray-500 text-sm mb-4">Create your first auto-apply configuration to get started!</p>
                <Button onClick={() => router.push("/dashboard/auto-apply/form")}>Create Configuration</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {submittedForms.map((form) => (
                  <div key={form.form_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{form.first_name && form.last_name ? `${form.first_name} ${form.last_name}` : 'Unnamed Configuration'}</h3>
                          <p className="text-sm text-muted-foreground">{form.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditForm(form.form_id)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteForm(form.form_id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>Created: {new Date(form.created_at).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Location: </span>
                        <span>{form.search_location || 'Not specified'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Job Terms: </span>
                        <span>{form.search_terms || 'Not specified'}</span>
                      </div>
                    </div>

                    {form.selected_resume_id && (
                      <div className="mt-3 text-sm">
                        <span className="text-muted-foreground">Selected Resume ID: </span>
                        <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                          {form.selected_resume_id}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Applied Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium">Applied Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {loadingJobs ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Loading applied jobs...</p>
                </div>
              ) : appliedJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No jobs have been applied to yet.</div>
              ) : (
                <table className="min-w-full text-sm border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-muted-foreground">
                      <th className="px-2 py-1 text-left">Job Title</th>
                      <th className="px-2 py-1 text-left">Company</th>
                      <th className="px-2 py-1 text-left">Status</th>
                      <th className="px-2 py-1 text-left">Applied At</th>
                      <th className="px-2 py-1 text-left">Job URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appliedJobs.map((job) => (
                      <tr key={job.id}>
                        <td className="px-2 py-1 font-medium">{job.job_title}</td>
                        <td className="px-2 py-1">{job.company_name}</td>
                        <td className="px-2 py-1">
                          <span className={
                            job.status === 'applied' ? 'text-green-600' :
                            job.status === 'error' ? 'text-red-600' :
                            job.status === 'skipped' ? 'text-yellow-600' :
                            'text-gray-600'
                          }>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-2 py-1">{new Date(job.applied_at).toLocaleString()}</td>
                        <td className="px-2 py-1">
                          <a href={job.job_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
                            View
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
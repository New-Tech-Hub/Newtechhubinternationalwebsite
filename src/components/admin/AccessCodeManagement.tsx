import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Key, Plus, Copy, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Course = {
  id: string;
  title: string;
};

type AccessCode = {
  id: string;
  course_id: string;
  access_code: string;
  is_active: boolean;
  expires_at: string | null;
  max_uses: number;
  current_uses: number;
  created_at: string;
  courses: {
    title: string;
  };
};

export const AccessCodeManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [accessCodes, setAccessCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    course_id: '',
    max_uses: 1,
    expires_in_days: 30,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('id, title')
        .eq('published', true)
        .order('title');

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      // Fetch access codes
      const { data: codesData, error: codesError } = await supabase
        .from('course_access_codes')
        .select(`
          *,
          courses (
            title
          )
        `)
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;
      setAccessCodes(codesData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const generateAccessCode = () => {
    // Generate a random 8-character alphanumeric code
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreateAccessCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.course_id) {
      toast.error('Please select a course');
      return;
    }

    try {
      const accessCode = generateAccessCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + formData.expires_in_days);

      const { error } = await supabase
        .from('course_access_codes')
        .insert({
          course_id: formData.course_id,
          access_code: accessCode,
          max_uses: formData.max_uses,
          expires_at: expiresAt.toISOString(),
          is_active: true,
        });

      if (error) throw error;

      toast.success(`Access code created: ${accessCode}`);
      setIsDialogOpen(false);
      setFormData({
        course_id: '',
        max_uses: 1,
        expires_in_days: 30,
      });
      fetchData();
    } catch (error: any) {
      console.error('Error creating access code:', error);
      toast.error('Failed to create access code');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Access code copied to clipboard');
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('course_access_codes')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Access code ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchData();
    } catch (error: any) {
      console.error('Error toggling access code:', error);
      toast.error('Failed to update access code');
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Are you sure you want to delete this access code?')) return;

    try {
      const { error } = await supabase
        .from('course_access_codes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Access code deleted');
      fetchData();
    } catch (error: any) {
      console.error('Error deleting access code:', error);
      toast.error('Failed to delete access code');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Access Code Management
            </CardTitle>
            <CardDescription>Generate and manage course access codes</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Generate Code
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate New Access Code</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateAccessCode} className="space-y-4">
                <div>
                  <Label>Course</Label>
                  <Select
                    value={formData.course_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, course_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Maximum Uses</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.max_uses}
                    onChange={(e) =>
                      setFormData({ ...formData, max_uses: parseInt(e.target.value) })
                    }
                  />
                </div>

                <div>
                  <Label>Expires In (Days)</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.expires_in_days}
                    onChange={(e) =>
                      setFormData({ ...formData, expires_in_days: parseInt(e.target.value) })
                    }
                  />
                </div>

                <Button type="submit" className="w-full">
                  Generate Access Code
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Access Code</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Uses</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accessCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">
                  <div className="flex items-center gap-2">
                    {code.access_code}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopyCode(code.access_code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{code.courses.title}</TableCell>
                <TableCell>
                  <Badge variant={code.is_active ? 'default' : 'secondary'}>
                    {code.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {code.current_uses} / {code.max_uses}
                </TableCell>
                <TableCell>
                  {code.expires_at
                    ? new Date(code.expires_at).toLocaleDateString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(code.id, code.is_active)}
                    >
                      {code.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteCode(code.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {accessCodes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No access codes generated yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

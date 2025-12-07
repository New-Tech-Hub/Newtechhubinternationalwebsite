import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Shield, Users, LogOut, BookOpen, Plus, Pencil, Trash2, Key, LayoutDashboard, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccessCodeManagement } from '@/components/admin/AccessCodeManagement';
import { DashboardMetrics } from '@/components/admin/DashboardMetrics';
import { InstallmentPaymentsManagement } from '@/components/admin/InstallmentPaymentsManagement';

type UserProfile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  roles: string[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: string;
  estimated_hours: number;
  price: number;
  video_preview_url: string | null;
  published: boolean;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: 'web_development' as 'web_development' | 'digital_marketing' | 'graphic_design' | 'ai_data' | 'cybersecurity' | 'freelancing' | 'video_editing',
    difficulty_level: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    estimated_hours: 8,
    price: 0,
    video_preview_url: '',
    published: true,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/auth');
    }
  }, [user, isAdmin, loading, navigate]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchUsers();
      fetchCourses();
    }
  }, [user, isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');

      if (rolesError) throw rolesError;

      const usersWithRoles = profiles?.map((profile) => ({
        ...profile,
        roles: roles?.filter((r) => r.user_id === profile.id).map((r) => r.role) || [],
      })) || [];

      setUsers(usersWithRoles);
    } catch (error: any) {
      toast.error('Failed to fetch users: ' + error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      // Remove existing roles
      await supabase.from('user_roles').delete().eq('user_id', userId);

      // Add new role
      const { error } = await supabase
        .from('user_roles')
        .insert([{ user_id: userId, role: newRole as 'admin' | 'moderator' | 'user' }]);

      if (error) throw error;

      toast.success('User role updated successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update role: ' + error.message);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch courses: ' + error.message);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        const { error } = await supabase
          .from('courses')
          .update(courseForm)
          .eq('id', editingCourse.id);
        if (error) throw error;
        toast.success('Course updated successfully');
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([{ ...courseForm, created_by: user?.id }]);
        if (error) throw error;
        toast.success('Course created successfully');
      }
      setIsDialogOpen(false);
      setEditingCourse(null);
      setCourseForm({
        title: '',
        description: '',
        category: 'web_development' as const,
        difficulty_level: 'beginner' as const,
        estimated_hours: 8,
        price: 0,
        video_preview_url: '',
        published: true,
      });
      fetchCourses();
    } catch (error: any) {
      toast.error('Failed to save course: ' + error.message);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title,
      description: course.description,
      category: course.category as any,
      difficulty_level: course.difficulty_level as any,
      estimated_hours: course.estimated_hours,
      price: course.price,
      video_preview_url: course.video_preview_url || '',
      published: course.published,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);
      if (error) throw error;
      toast.success('Course deleted successfully');
      fetchCourses();
    } catch (error: any) {
      toast.error('Failed to delete course: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading || loadingUsers || loadingCourses) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="border-b bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-[hsl(17,100%,60%)]" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Courses
            </TabsTrigger>
            <TabsTrigger value="access-codes" className="gap-2">
              <Key className="h-4 w-4" />
              Access Codes
            </TabsTrigger>
            <TabsTrigger value="installments" className="gap-2">
              <CreditCard className="h-4 w-4" />
              Installments
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <DashboardMetrics />
          </TabsContent>

          <TabsContent value="access-codes">
            <AccessCodeManagement />
          </TabsContent>

          <TabsContent value="installments">
            <InstallmentPaymentsManagement />
          </TabsContent>

          <TabsContent value="courses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Course Management
                    </CardTitle>
                    <CardDescription>Create and manage courses</CardDescription>
                  </div>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        setEditingCourse(null);
                        setCourseForm({
                          title: '',
                          description: '',
                          category: 'web_development' as const,
                          difficulty_level: 'beginner' as const,
                          estimated_hours: 8,
                          price: 0,
                          video_preview_url: '',
                          published: true,
                        });
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Course
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingCourse ? 'Edit Course' : 'Create New Course'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleCourseSubmit} className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            required
                            value={courseForm.title}
                            onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            required
                            value={courseForm.description}
                            onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Category</Label>
                            <Select
                              value={courseForm.category}
                              onValueChange={(value) => setCourseForm({ ...courseForm, category: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="web_development">Web Development</SelectItem>
                                <SelectItem value="digital_marketing">Marketing</SelectItem>
                                <SelectItem value="graphic_design">Design</SelectItem>
                                <SelectItem value="ai_data">AI/ML</SelectItem>
                                <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                                <SelectItem value="freelancing">Freelancing</SelectItem>
                                <SelectItem value="video_editing">Video Editing</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Difficulty Level</Label>
                            <Select
                              value={courseForm.difficulty_level}
                              onValueChange={(value) => setCourseForm({ ...courseForm, difficulty_level: value as any })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginner">Beginner</SelectItem>
                                <SelectItem value="intermediate">Intermediate</SelectItem>
                                <SelectItem value="advanced">Advanced</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Estimated Hours</Label>
                            <Input
                              type="number"
                              required
                              value={courseForm.estimated_hours}
                              onChange={(e) => setCourseForm({ ...courseForm, estimated_hours: parseInt(e.target.value) })}
                            />
                          </div>
                          <div>
                            <Label>Price (₦)</Label>
                            <Input
                              type="number"
                              required
                              value={courseForm.price}
                              onChange={(e) => setCourseForm({ ...courseForm, price: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Video Preview URL (YouTube Embed)</Label>
                          <Input
                            placeholder="https://www.youtube.com/embed/..."
                            value={courseForm.video_preview_url}
                            onChange={(e) => setCourseForm({ ...courseForm, video_preview_url: e.target.value })}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Use YouTube embed URL format
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="published"
                            checked={courseForm.published}
                            onChange={(e) => setCourseForm({ ...courseForm, published: e.target.checked })}
                            className="rounded"
                          />
                          <Label htmlFor="published">Published</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingCourse ? 'Update' : 'Create'} Course
                          </Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Video Preview</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                          No courses yet. Create your first course!
                        </TableCell>
                      </TableRow>
                    ) : (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.title}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {course.category.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>₦{course.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={course.published ? 'default' : 'secondary'}>
                              {course.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {course.video_preview_url ? '✓' : '✗'}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>User Management</CardTitle>
                </div>
                <CardDescription>Manage user roles and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.full_name || 'N/A'}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {user.roles.map((role) => (
                              <Badge
                                key={role}
                                variant={role === 'admin' ? 'default' : 'secondary'}
                              >
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Select
                            value={user.roles[0] || 'user'}
                            onValueChange={(value) => updateUserRole(user.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./queryClient";

// ==================== TYPES ====================

export interface Template {
  id: string;
  name: string;
  description: string;
  tags: string[];
  frameworkType: string;
  status: 'ready' | 'processing' | 'error';
  statusMessage?: string | null;
  templateSpec?: any;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface GeneratedSite {
  id: string;
  slug: string;
  templateId: string;
  templateName: string;
  clientDetails: any;
  brandInputs: any;
  sections: any[];
  createdAt: Date;
  outputPath: string;
}

export interface GenerationInput {
  templateId: string;
  slug: string;
  clientDetails: {
    companyName: string;
    domain?: string;
    tagline?: string;
    phone?: string;
    email?: string;
    address?: string;
    ctaLabel: string;
    ctaLink: string;
  };
  brandInputs: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    headingFont: string;
    bodyFont: string;
  };
  sections: Array<{
    id: string;
    enabled: boolean;
    order: number;
  }>;
}

// ==================== TEMPLATES ====================

export function useTemplates() {
  return useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });
}

export function useTemplate(id: string) {
  return useQuery<Template>({
    queryKey: ["/api/templates", id],
    enabled: !!id,
  });
}

export function useUploadTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { file: File; name: string; description: string; tags: string }) => {
      const formData = new FormData();
      formData.append('file', data.file);
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('tags', data.tags);

      const res = await fetch('/api/templates/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload failed');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
  });
}

export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
    },
  });
}

// ==================== GENERATION ====================

export function useGenerateSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: GenerationInput) => {
      const res = await apiRequest('POST', '/api/generate', data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-sites"] });
    },
  });
}

// ==================== GENERATED SITES ====================

export function useGeneratedSites() {
  return useQuery<GeneratedSite[]>({
    queryKey: ["/api/generated-sites"],
  });
}

export function useGeneratedSite(id: string) {
  return useQuery<GeneratedSite>({
    queryKey: ["/api/generated-sites", id],
    enabled: !!id,
  });
}

export function useDeleteGeneratedSite() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/generated-sites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/generated-sites"] });
    },
  });
}

export function getDownloadUrl(id: string): string {
  return `/api/generated-sites/${id}/download`;
}

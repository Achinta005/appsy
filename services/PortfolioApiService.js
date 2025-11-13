import { apiCall } from "./baseApi";

export const PortfolioApiService = {
  // Admin
  Ai_enhance: async (plainText) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/ai-enhance`, {
      method: "POST",
      body: JSON.stringify({ text: plainText }),
    });
  },

  Upload_blog: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/upload_blog`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  Fetch_IP: async (userId) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/get-ip`, {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
    });
  },

  ViewIp: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/view-ip`);
  },

  // Authentication
  Register: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  Login: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/auth/login`, {
      method: "POST",
      body: JSON.stringify(formData),
    });
  },

  // AnimeList
  FetchAnimeList: async (username) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/alist/anilist/BaseFunction/fetch`,
      {
        method: "POST",
        body: JSON.stringify({ username: username.trim() }),
      }
    );
  },

  // About 
  fetchSkill: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Skilldata`);
  },

  fetchEducation: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Educationdata`);
  },

  fetchCertificates: async () => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/Certificatesdata`);
  },

  fetchProjects: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/project/projects_data`);
  },

  UplaodProject: async (formData) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/project/project_upload`, {
      method: "POST",
      body: formData,
    });
  },

  fetchBlog: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog/blog_data`);
  },

  fetchBlogBySlug: async (slug) => {
    return apiCall(
      `${process.env.NEXT_PUBLIC_PYTHON_API_URL}/blog/blog_data/${slug}`);
  },

  //Download Resume
  downloadResume: async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/about/resume`);

    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);
  },

  //Post Contact response
  PostContactResponse: async (data) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/contact/upload_response`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  //View Contact Responses
  ContactResponses: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/contact/contact_responses`);
  },

  //Post Notepad Documents
  Notepad: async (title, content) => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/create_documents`, {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
  },

  //Fetch User Notepad Documents
  FetchNotepadDocs: async () => {
    return apiCall(`${process.env.NEXT_PUBLIC_PYTHON_API_URL}/admin/fetch_documents`);
  },

};

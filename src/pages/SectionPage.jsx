import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CredentialCard from "../components/CredentialCard";
import { FaCopy, FaPaperclip } from "react-icons/fa";
import iconMapping from "../utils/iconMapping"; 

const SectionPage = () => {
  const { id } = useParams(); // Get section ID from URL
  const location = useLocation(); // Get section name from navigation state
  const sectionName = location.state?.sectionName || "Section";

  const [credentials, setCredentials] = useState([]); // Store fetched credentials
  const [projects, setProjects] = useState([]); // Store projects
  const [attachments, setAttachments] = useState({}); // Store attachments
  const [selectedProject, setSelectedProject] = useState("All");

 // Fetch credentials for the section
 useEffect(() => {
  const fetchSectionData = async () => {
    try {
      const credentialsResponse = await fetch(
        `http://localhost:8000/api/credentials/${id}`
      );

      if (!credentialsResponse.ok ) {
        throw new Error("Failed to fetch section credentials");
      }

      const credentialsData = await credentialsResponse.json();

       // Extract unique projects associated with this section
       const uniqueProjects = credentialsData.reduce((acc, cred) => {
        if (!acc.find((proj) => proj.id === cred.project_id)) {
          acc.push({ id: cred.project_id, name: cred.project_name });
        }
        return acc;
      }, []);

      setCredentials(credentialsData);
      setProjects(uniqueProjects);

      // Fetch attachments for all unique projects
      const attachmentsData = {};
      for (const project of uniqueProjects) {
        const attachmentsResponse = await fetch(
          `http://localhost:8000/api/attachments/${project.id}`
        );
        const projectAttachments = await attachmentsResponse.json();
        attachmentsData[project.id] = projectAttachments;
      }

      setAttachments(attachmentsData);

    } catch (error) {
      console.error("Error fetching section data:", error);
      toast.error("Failed to load section data", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    }
  };


  fetchSectionData();
}, [id]);

  // Filter credentials based on selected project
  const filteredCredentials = credentials.filter((cred) => {
    if (selectedProject === "All") return true;
    return cred.project_id === parseInt(selectedProject, 10);
  });

  const filteredAttachments = selectedProject === "All"
  ? Object.values(attachments).flat()
  : attachments[selectedProject] || [];

  // Copy credentials for the selected project
  const copyProjectCredentials = () => {
    if (selectedProject === "All") {
      toast.error("Please select a specific project to copy credentials!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
  
    const project = projects.find(
      (proj) => proj.id === parseInt(selectedProject, 10)
    );
  
    const projectName = project?.name || "Unknown";
  
    // Get attachments for the selected project
    const projectAttachments = attachments[selectedProject] || [];
  
    // Format attachments
    const formattedAttachments =
      projectAttachments.length > 0
        ? projectAttachments
            .map(
              (attachment, index) =>
                `Attachment${index + 1}: ${attachment.url}\nAttachment${index + 1} Type: ${attachment.attachment_type_name}`
            )
            .join("\n")
        : "No attachments";
  
    // Format credentials
    const formattedCredentials = filteredCredentials
      .map(
        (cred, index) =>
          `--- Category${index + 1} ---\nCategory: ${cred.category}\nURL: ${cred.url}\nUsername: ${cred.username}\nPassword: ${cred.password}\nNotes: ${cred.notes}`
      )
      .join("\n\n");
  
      const clipboardContent = `Project: ${projectName}\n\nAttachments for ${projectName}:\n${formattedAttachments}\n\n${formattedCredentials}`;
  
    navigator.clipboard.writeText(clipboardContent);
  
    toast.success(`Credentials for ${projectName} copied to clipboard!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };
  

  // console.log("Credential Data:", credentials);


  return (
    <div className="min-h-screen bg-[#F1FAFF] p-6">
      <ToastContainer />
      <div id="logo">
        <img
          src="https://dexpertsystems.in/assets/logo/web_icon.png"
          alt="Logo"
          style={{ height: "50px" }}
          onClick={() => window.history.back()}
        />
      </div>
      <header className="mb-6 mt-6">
        <h2 className="text-3xl font-bold text-[#336699]">{sectionName} Section</h2>
        <button
  onClick={() => window.history.back()}
  className="relative text-sm text-[#224466] group hover:text-[#004466] font-semibold transition-all duration-300 ease-in-out ml-4"
>
  <span className="absolute left-0 -translate-x-full group-hover:translate-x-0 transition-all duration-300 ease-in-out">
    ⇠
  </span>
  <span className="ml-3 group-hover:underline">Back</span>
</button>

      </header>

      {/* Filter and Copy Credentials */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <div className="w-full md:w-auto">
          <label htmlFor="projectFilter" className="block text-[#224466] mb-2">
            <b>Filter by Project:</b>
          </label>
          <select
            id="projectFilter"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full md:w-auto p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#336699]"
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        {selectedProject !== "All" && (
        <div className="mb-6 text-right">
          <button
            onClick={copyProjectCredentials}
            className="bg-[#336699] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#224466] flex items-center justify-center"
          >
            <FaCopy className="mr-2" /> Copy{" "}
            {projects.find((proj) => proj.id === parseInt(selectedProject, 10))
              ?.name || "Project"}{" "}
            Credentials
          </button>
        </div>
      )}
      </div>

      {/* Attachments Section */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[#336699] mb-4">Attachments</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttachments.length > 0 ? (
            filteredAttachments.map((attachment, index) => (
              <div
                key={index}
                className="bg-[#EAF4FF] p-4 rounded-lg shadow-sm border border-[#D1E7FF]"
              >
                <div className="flex items-center mb-2 text-[#336699]">
                {iconMapping[attachment.attachment_type_icon] || (
                  <FaPaperclip className="text-[#336699] mr-2" />
                  )}
                  
                  <span className="font-semibold text-[#224466] truncate">
                    &nbsp;{attachment.attachment_type_name}
                  </span>
                </div>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#336699] hover:underline text-sm truncate block"
                >
                  {attachment.url}
                </a>
              </div>
            ))
          ) : (
            <p className="text-center text-[#224466] col-span-full">
              No attachments found for the selected project.
            </p>
          )}
        </div>
      </div>


      {/* Credential Cards */}
      <div className="mb-6">
      <h3 className="text-2xl font-semibold text-[#336699] mb-4">Credentials</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCredentials.length > 0 ? (
          filteredCredentials.map((cred) => (
            <CredentialCard key={cred.id} {...cred} />
          ))
        ) : (
          <p className="text-center text-[#224466] col-span-full">
            No credentials found for the selected project.
          </p>
        )}
      </div>
      </div>
    </div>
  );
};

export default SectionPage;

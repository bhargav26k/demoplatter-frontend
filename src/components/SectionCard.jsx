import React from "react";
import { FaCopy } from "react-icons/fa";
import { toast } from "react-toastify";

const SectionCard = ({ id, title, icon, credentials, onClick }) => {
  const copySectionCredentials = (e) => {
    e.stopPropagation(); // Prevent card click event from firing
    if (!credentials || credentials.length === 0) {
      toast.error("No credentials available to copy!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      return;
    }
  
    // Group credentials by project name
    const projects = credentials.reduce((acc, cred) => {
      if (!acc[cred.project_name]) {
        acc[cred.project_name] = {
          attachments: cred.attachments || [],
          categories: [],
        };
      }
      acc[cred.project_name].categories.push(cred);
      return acc;
    }, {});
  
    const formattedCredentials = Object.entries(projects)
      .map(([projectName, projectData], projectIndex) => {
        // Format attachments for the project
        const formattedAttachments =
          projectData.attachments.length > 0
            ? projectData.attachments
                .map(
                  (attachment, index) =>
                    `Attachment${index + 1}: ${attachment.url}\nAttachment${index + 1} Type: ${attachment.attachment_type_name}`
                )
                .join("\n")
            : "No Attachments";
  
        // Format categories for the project
        const formattedCategories = projectData.categories
          .map(
            (category, categoryIndex) =>
              `\n--- Category${categoryIndex + 1} ---\nCategory: ${category.category}\nURL: ${category.url}\nUsername: ${category.username}\nPassword: ${category.password}\nNotes: ${category.notes}`
          )
          .join("\n");
  
        return `Project${projectIndex + 1} Name: ${projectName}\n\nAttachments for Project${projectIndex + 1}:\n${formattedAttachments}\n\n${formattedCategories}`;
      })
      .join("\n\n\n");
  
    const clipboardContent = `Section: ${title}\n\n${formattedCredentials}`;
    navigator.clipboard.writeText(clipboardContent);
  
    toast.success("Section credentials copied to clipboard!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };
  
  

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-6 hover:bg-[#def2fd] hover:shadow-xl transition duration-300 flex justify-between items-center cursor-pointer"
    >
      <div className="flex items-center space-x-4">
        <div className="text-3xl text-[#336699]">{icon}</div>
        <h2 className="text-lg font-semibold text-[#224466]">{title}</h2>
      </div>
      <div>
        <FaCopy
          className="text-[#92abc4] cursor-pointer hover:text-[#224466] text-xl"
          title="Copy All Credentials"
          onClick={copySectionCredentials}
        />
      </div>
    </div>
  );
};

export default SectionCard;

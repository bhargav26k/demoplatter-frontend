import React, { useState, useEffect } from "react";
import { FaCopy, FaEye, FaEyeSlash, FaInfoCircle, FaRegListAlt } from "react-icons/fa"; // Import icons
import { toast } from "react-toastify";
import iconMapping from "../utils/iconMapping"; // Import the icon mapping

const CredentialCard = ({
  project_id,
  project_name,
  category,
  url,
  username,
  password,
  notes,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [attachments, setAttachments] = useState([]);

   // Fetch project-level attachments dynamically
   useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/attachments/${project_id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attachments");
        }
        const data = await response.json();
        setAttachments(data);
      } catch (error) {
        console.error("Error fetching attachments:", error);
        toast.error(`Failed to load attachments for ${project_name}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    };

    if (project_id) {
      fetchAttachments();
    }
  }, [project_id]);


  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    toast.success(`${field} copied to clipboard!`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const copyWithAttachments = () => {
    const formattedAttachments =
      attachments.length > 0
        ? attachments
            .map(
              (attachment, index) =>
                `Attachment${index + 1}: ${attachment.url}\nAttachment${index + 1} Type: ${attachment.attachment_type_name}`
            )
            .join("\n")
        : "No attachments";

    const content = `Project: ${project_name}\n\nAttachments for ${project_name}:\n${formattedAttachments}\n\nCategory: ${category}\nURL: ${url}\nUsername: ${username}\nPassword: ${password}\nNotes: ${notes}`;
    navigator.clipboard.writeText(content);
    toast.success(`Copied credentials with attachments for ${project_name}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };


  const copyWithoutAttachments = () => {
    const content = `Project: ${project_name}\n\nCategory: ${category}\nURL: ${url}\nUsername: ${username}\nPassword: ${password}\nNotes: ${notes}`;
    navigator.clipboard.writeText(content);
    toast.success(`Copied credentials without attachments for ${project_name}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: true,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 relative flex items-start">
      <div className="flex-1">
        {/* Category Section */}
        <div className="grid grid-cols-12 gap-2 items-center mb-4">
          <FaRegListAlt className="text-[#336699] col-span-1" title="Category" />
          <span className="text-[#224466] col-span-11 truncate">
            <span className="font-semibold">Category: </span> {category}
          </span>
        </div>

        {/* URL Section */}
        <div className="grid grid-cols-12 gap-2 items-center mb-4">
          <FaCopy
            className="text-[#92abc4] hover:text-[#224466] cursor-pointer col-span-1"
            onClick={() => copyToClipboard(url, "URL")}
            title="Copy URL"
          />
          <span className="text-[#224466] col-span-10 truncate flex items-center">
            <span className="font-semibold">Link: </span>&nbsp;
            <a
              href={url}
              className="text-[#336699] hover:underline truncate"
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </span>
        </div>

        {/* Username Section */}
        <div className="grid grid-cols-12 gap-2 items-center mb-4">
          <FaCopy
            className="text-[#92abc4] hover:text-[#224466] cursor-pointer col-span-1"
            onClick={() => copyToClipboard(username, "Username")}
            title="Copy Username"
          />
          <p className="text-[#224466] col-span-11 truncate">
            <span className="font-semibold">Username: </span> {username}
          </p>
        </div>

        {/* Password Section */}
        <div className="grid grid-cols-12 gap-2 items-center mb-4">
          <FaCopy
            className="text-[#92abc4] hover:text-[#224466] cursor-pointer col-span-1"
            onClick={() => copyToClipboard(password, "Password")}
            title="Copy Password"
          />
          <span className="text-[#224466] col-span-10 truncate flex items-center">
            <span className="font-semibold">Password: &nbsp;</span>
            {isPasswordVisible ? password : "******"}&nbsp;&nbsp;&nbsp;
            <div
              className="cursor-pointer text-[#336699] col-span-1"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              title={isPasswordVisible ? "Hide Password" : "Show Password"}
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </div>
          </span>
        </div>

        {/* Notes Section */}
        <div className="grid grid-cols-12 gap-2 items-center">
          <FaInfoCircle
            className="text-[#336699] col-span-1"
            title="Additional Info"
          />
          <p className="text-sm text-[#224466] col-span-11 truncate">{notes}</p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="absolute top-4 right-4 flex flex-col space-y-1">
  <button
    onClick={copyWithAttachments}
    className="bg-[#F1FAFF] text-[#336699] px-2 py-1 rounded-md hover:bg-[#D1E7FF] hover:text-[#224466] flex items-center justify-center text-xs font-medium transition duration-300 ease-in-out border border-[#D1E7FF]"
    title="Copy all data (with attachments)"
  >
    <FaCopy className="mr-1 text-sm" />
    Attachments
  </button>
  <button
    onClick={copyWithoutAttachments}
    className="bg-[#F1FAFF] text-[#336699] px-2 py-1 rounded-md hover:bg-[#D1E7FF] hover:text-[#224466] flex items-center justify-center text-xs font-medium transition duration-300 ease-in-out border border-[#D1E7FF]"
    title="Copy core data (without attachments)"
  >
    <FaCopy className="mr-1 text-sm" />
    Only Creds
  </button>
</div>


    </div>
  );
};

export default CredentialCard;

import React, { useState, useEffect } from "react";
import SectionCard from "../components/SectionCard";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import iconMapping from "../utils/iconMapping"; // Import the icon mapping



const HomePage = () => {
  const [sections, setSections] = useState([]);
  const [credentials, setCredentials] = useState({});
  const [attachments, setAttachments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

 // Fetch all sections
 useEffect(() => {
  fetch("http://localhost:8000/api/sections")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch sections");
      }
      return response.json();
    })
    .then((data) => setSections(data))
    .catch((error) => {
      console.error("Error fetching sections:", error);
      toast.error("Failed to load sections", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
    });
}, []);


  // Fetch credentials and attachments for all sections dynamically
  useEffect(() => {
    const fetchAllData = async () => {
      const fetchedCredentials = {};
      const fetchedAttachments = {};

      for (const section of sections) {
        try {
          // Fetch credentials for the current section
          const credentialsResponse = await fetch(
            `http://localhost:8000/api/credentials/${section.id}`
          );
          const credentialsData = await credentialsResponse.json();
          fetchedCredentials[section.id] = credentialsData;

          // Fetch attachments for each project in the section's credentials
          for (const credential of credentialsData) {
            if (!fetchedAttachments[credential.project_id]) {
              try {
                const attachmentsResponse = await fetch(
                  `http://localhost:8000/api/attachments/${credential.project_id}`
                );
                const attachmentsData = await attachmentsResponse.json();
                fetchedAttachments[credential.project_id] = attachmentsData;
              } catch (attachmentsError) {
                console.error(
                  `Error fetching attachments for project ${credential.project_id}:`,
                  attachmentsError
                );
                toast.error(
                  `Failed to load attachments for project ${credential.project_name}`,
                  {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: true,
                  }
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `Error fetching credentials for section ${section.id}:`,
            error
          );
          toast.error(`Failed to load credentials for ${section.title}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
          });
        }
      }

      setCredentials(fetchedCredentials);
      setAttachments(fetchedAttachments);
    };

    if (sections.length > 0) {
      fetchAllData();
    }
  }, [sections]);


  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (id, title) => {
    navigate(`/section/${id}`, { state: { sectionName: title } });
  };

  return (
    <div className="min-h-screen bg-[#F1FAFF] p-6">
     <ToastContainer />
    <div id="logo">
      <img
        src="https://dexpertsystems.in/assets/logo/web_icon.png" // Replace with actual image source
        alt="Logo"
        style={{ height: '50px' }}
      />
    </div>
      <header className="text-center mb-8">

        <h1 className="text-4xl font-bold text-[#336699]">Dexpert Systems Private Limited</h1>
        <p className="text-[#224466]">Our Achievements</p>
      </header>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search for a section..."
          className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#336699]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSections.map((section) => {
          const sectionCredentials = credentials[section.id] || []; // Credentials for the section
          const sectionAttachments = sectionCredentials.map((cred) => ({
            ...cred,
            attachments: attachments[cred.project_id] || [],
          }));
          return (
            <SectionCard
              key={section.id}
              id={section.id}
              title={section.title}
              icon={iconMapping[section.icon]  || iconMapping.default}
              credentials={sectionAttachments} // Pass credentials
              onClick={() => handleSectionClick(section.id, section.title)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;

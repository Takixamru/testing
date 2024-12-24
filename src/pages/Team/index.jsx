import React, { useState, useEffect } from "react";

const Team = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      const url =
        "https://raw.githubusercontent.com/Project-PixelStar/official_devices/refs/heads/14/team.json";
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        // Fetch GitHub profile pictures for each team member
        const updatedTeam = await Promise.all(
          data.team.map(async (member) => {
            if (member.socials.github) {
              const githubResponse = await fetch(`https://api.github.com/users/${member.socials.github}`);
              const githubData = await githubResponse.json();
              return {
                ...member,
                avatarUrl: githubData.avatar_url, // GitHub profile picture URL
              };
            }
            return member;
          })
        );

        setTeam(updatedTeam);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching team data:", error);
        setLoading(false);
      }
    };

    fetchTeamData();
  }, []);

  if (loading) {
    return <p className="text-white text-center">Loading team members...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 sm:p-8">
      <div className="mt-28 max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Meet the Team</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-opacity-40 bg-slate-900 text-white p-6 rounded-xl text-center"
            >
              <div className="flex justify-center mb-4">
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt={member.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-500"></div> // Fallback if no avatar URL
                )}
              </div>
              <h3 className="text-2xl font-bold mt-4">{member.name}</h3>
              <p className="text-lg text-slate-300">{member.role}</p>
              <div className="mt-4 space-y-2">
                {member.socials.github && (
                  <a
                    href={`https://github.com/${member.socials.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    GitHub
                  </a>
                )}
                {member.socials.telegram && (
                  <a
                    href={`https://t.me/${member.socials.telegram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-600"
                  >
                    Telegram
                  </a>
                )}
                {member.socials.xda && member.socials.xda !== "" && (
                  <a
                    href={`https://forum.xda-developers.com/member/${member.socials.xda}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-500 hover:text-green-700"
                  >
                    XDA
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;

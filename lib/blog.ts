// TODO Make dynamic
// See https://github.com/Sinytra/Wiki/issues/65
function getAllPosts() {
  return [
    {
      id: "2024-11-15-scaling",
      title: "The Scaling Update",
      date: "2024-11-15",
      excerpt: "Improving response times & future scalability."
    },
    {
      id: "2024-10-27-search",
      title: "Search & Versions Update",
      date: "2024-10-27",
      excerpt: "Global search, versioned documentation and new customization options!"
    },
    {
      id: "2024-10-05-community-docs",
      title: "Community Wiki Update",
      date: "2024-10-05",
      excerpt: "In the first major wiki update, we're introducing community docs and UI localization."
    },
    {
      id: "2024-09-10-introduction",
      title: "Introducing the Modded Minecraft Wiki!",
      date: "2024-09-10",
      excerpt: "Sinytra is proud to present our latest project in the modding community"
    }
  ];
}

export default {
  getAllPosts
}
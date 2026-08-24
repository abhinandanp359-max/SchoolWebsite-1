export const mainNav = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about", children: [
    { name: "About Us", path: "/about" },
    { name: "School History", path: "/about/history" },
    { name: "Principal's Message", path: "/about/principal-message" }
  ]},
  { name: "Academics", path: "/academics" },
  { name: "Campus", path: "/facilities" },
  { name: "Activities", path: "/activities" },
  { name: "Events", path: "/events" },
  { name: "Admissions", path: "/admissions" },
  { name: "Contact", path: "/contact" }
];

export const footerLinks = {
  quickLinks: [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Academics", path: "/academics" },
    { name: "Events", path: "/events" },
    { name: "Admissions", path: "/admissions" },
    { name: "Contact", path: "/contact" }
  ],
  about: [
    { name: "School History", path: "/about/history" },
    { name: "Principal's Message", path: "/about/principal-message" },
    { name: "Gallery", path: "/gallery" }
  ]
};

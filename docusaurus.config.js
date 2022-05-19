// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/oceanicNext");
// const darkCodeTheme = require("prism-react-renderer/themes/vsDark");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Documentation | Multy",
  tagline: "",
  url: "https://docs.multy.dev",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "multy", // Usually your GitHub org/user name.
  projectName: "multydocs", // Usually your repo name.
  plugins: ["docusaurus-plugin-sass"],
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Poppins&display=swap",
  ],
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        sitemap: {
          changefreq: "daily",
          priority: 0.5,
        },
        docs: {
          // sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/",
          // Please change this to your repo.
          editUrl: "https://github.com/multycloud/multy-docs/tree/main",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/multycloud/multy-docs/tree/main",
        },
        theme: {
          customCss: [
            require.resolve(
              "./node_modules/modern-normalize/modern-normalize.css"
            ),
            require.resolve("./src/css/custom.scss"),
          ],
        },
        googleAnalytics: {
          trackingID: "UA-226950854-1",
          anonymizeIP: true,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "",
        logo: {
          alt: "Multy Logo",
          src: "img/multy.jpg",
          href: "https://multy.dev",
        },
        items: [
          {
            type: "doc",
            docId: "introduction",
            position: "left",
            label: "Documentation",
          },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://discord.gg/rgaKXY4tCZ",
            className: "header-discord-link",
            "aria-label": "Discord channel",
            position: "right",
          },
          {
            href: "https://github.com/multycloud/multy",
            className: "header-github-link",
            "aria-label": "GitHub repository",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Documentation",
                to: "/introduction",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Discord",
                href: "https://discord.gg/rgaKXY4tCZ",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/multycloud",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/multycloud/multy",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Multy.`,
      },
      colorMode: {
        defaultMode: "light",
        disableSwitch: true,
      },
      announcementBar: {
        id: "announcement-bar", // Increment on change
        backgroundColor: "#0565ff",
        textColor: "white",
        content: `⭐️ If you like Multy, give it a star on <a target="_blank" rel="noopener noreferrer" href="https://github.com/multycloud/multy">GitHub</a>! ⭐️`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ["hcl", "bash", "protobuf"],
      },
    }),
};

module.exports = config;

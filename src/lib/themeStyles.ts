// themeStyles.ts
export const getThemeStyles = (currentTheme: "dark" | "light", isDragging = false) => {
  return {
    bgStyle:
      currentTheme === "dark"
        ? "bg-gradient-to-br from-black to-slate-900 text-slate-100"
        : "bg-gradient-to-br from-gray-50 to-gray-200 text-gray-800",

    cardBgStyle:
      currentTheme === "dark"
        ? "bg-slate-900/50 border-slate-700/50"
        : "bg-white border-2 border-gray-300",

    tabsBgStyle: currentTheme === "dark" ? "bg-slate-800/50" : "bg-gray-200",

    tabsActiveStyle:
      currentTheme === "dark"
        ? "data-[state=active]:bg-slate-700 data-[state=active]:text-blue-400"
        : "data-[state=active]:bg-blue-600 data-[state=active]:text-white",

    inputBgStyle:
      currentTheme === "dark"
        ? "bg-slate-800 border-slate-600 text-white"
        : "bg-gray-50 border-gray-300 text-gray-800",

    fileItemBgStyle:
      currentTheme === "dark"
        ? "bg-slate-800/70 border-slate-700/70"
        : "bg-gray-100 border-gray-300",

    buttonPrimaryStyle:
      currentTheme === "dark"
        ? "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/50"
        : "bg-blue-600 hover:bg-blue-400 text-white border border-blue-500",

    buttonOutlineStyle:
      currentTheme === "dark"
        ? "border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100"
        : "border-gray-400 text-gray-700 hover:bg-gray-200 hover:text-gray-900",

    infoBgStyle:
      currentTheme === "dark"
        ? "bg-blue-900/30 border-blue-700/50"
        : "bg-blue-100/70 border-blue-300/50",

    infoTextStyle: currentTheme === "dark" ? "text-blue-400" : "text-blue-700",

    textPrimaryStyle: currentTheme === "dark" ? "text-slate-100" : "text-gray-900",

    textSecondaryStyle: currentTheme === "dark" ? "text-slate-400" : "text-gray-700",

    textTertiaryStyle: currentTheme === "dark" ? "text-slate-500" : "text-gray-500",

    uploadBorderStyle: isDragging
      ? currentTheme === "dark"
        ? "border-blue-500 bg-blue-900/20"
        : "border-blue-500 bg-blue-200/50"
      : currentTheme === "dark"
      ? "border-slate-700 hover:border-blue-600/50 hover:bg-slate-800/50"
      : "border-gray-300 hover:border-blue-500/50 hover:bg-gray-100/50",
  };
};

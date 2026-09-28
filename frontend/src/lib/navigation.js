// Smoothly scrolls to a homepage section when already on "/", otherwise lets the router navigate.
export const handleSectionNav = (event, to, pathname) => {
  if (pathname !== "/" || !to.startsWith("/")) return;
  const [path, id] = to.split("#");
  if (path !== "/") return;
  event.preventDefault();
  if (id) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  else window.scrollTo({ top: 0, behavior: "smooth" });
  window.history.replaceState(null, "", to);
};

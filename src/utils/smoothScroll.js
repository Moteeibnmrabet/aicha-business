export const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = 80; // Hauteur de la navbar
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

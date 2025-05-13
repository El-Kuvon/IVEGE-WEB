module.exports = function(eleventyConfig) {

    // Indica a Eleventy que copie la carpeta 'assets' completa a la salida '_site'
    eleventyConfig.addPassthroughCopy("src/assets");
  
    // (Opcional) Puedes añadir más configuraciones aquí después
  
    // Importante para que Eleventy sepa dónde buscar los archivos fuente
    return {
      dir: {
        input: "src",       // Carpeta de entrada
        includes: "_includes", // Carpeta para includes/layouts
        data: "_data",      // Carpeta para datos globales (opcional)
        output: "_site"     // Carpeta de salida donde se genera el sitio
      },
      passthroughFileCopy: true, // Asegura que addPassthroughCopy funcione bien
      htmlTemplateEngine: "njk", // Motor de plantillas por defecto (Nunjucks)
      markdownTemplateEngine: "njk" // Si usas Markdown después
    };
  };
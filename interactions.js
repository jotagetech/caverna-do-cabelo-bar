// Futebol: so tem cerca de 1,2s de acao real dentro dos 5s originais (o
// jogador entra e sai de quadro no resto do tempo); tocar isso em loop
// ficaria com corte feio, entao aparece e some uma unica vez, disparado
// quando a secao "A experiencia" entra na tela.
(function () {
  var FUTEBOL_SEGMENT = [15, 65];
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  setupFutebolFlourish();

  function setupFutebolFlourish() {
    var futebolMount = document.getElementById("mount-futebol");
    var trigger = document.querySelector(".experience__copy");
    var supportsObserver = "IntersectionObserver" in window;

    if (!futebolMount || !trigger || !supportsObserver) {
      return;
    }

    if (typeof lottie === "undefined" || prefersReducedMotion) {
      return;
    }

    var futebolAnim = null;
    var shouldPlayWhenReady = false;

    fetch("assets/futebol.json")
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        futebolAnim = lottie.loadAnimation({
          container: futebolMount,
          renderer: "svg",
          loop: false,
          autoplay: false,
          animationData: data,
        });

        futebolAnim.addEventListener("complete", function () {
          futebolMount.classList.remove("is-visible");
        });

        if (shouldPlayWhenReady) {
          futebolMount.classList.add("is-visible");
          futebolAnim.playSegments(FUTEBOL_SEGMENT, true);
        }
      });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          observer.unobserve(entry.target);

          if (futebolAnim) {
            futebolMount.classList.add("is-visible");
            futebolAnim.playSegments(FUTEBOL_SEGMENT, true);
          } else {
            shouldPlayWhenReady = true;
          }
        });
      },
      { threshold: 0.4 }
    );

    observer.observe(trigger);
  }
})();

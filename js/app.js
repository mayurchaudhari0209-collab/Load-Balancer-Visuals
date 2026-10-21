(() => {
  "use strict";

  const steps = [
    {title:"Visitors arrive", diagram:"01 — Visitors arrive", icon:"↗", plain:"Ravi’s online shop gets visitors. Each visitor brings a request, just like a customer arriving at a busy store.", technical:"Client request", watch:"The visitor card lights up first.", status:"WAITING FOR VISITORS"},
    {title:"DNS finds the way", diagram:"02 — DNS finds the way", icon:"⌁", plain:"A customer uses Ravi’s web address. Route 53 is like a directory that helps the browser find where the website lives.", technical:"Amazon Route 53 · DNS", watch:"The blue request travels from Visitors to Route 53, then toward the ALB.", status:"LOOKING UP THE ADDRESS"},
    {title:"Meet the ALB", diagram:"03 — Meet the ALB", icon:"⇄", plain:"The Application Load Balancer is the receptionist. It accepts incoming web requests and decides which suitable server should handle each one.", technical:"Application Load Balancer (ALB)", watch:"The teal ALB card appears as the front door for incoming requests.", status:"REQUEST ARRIVED AT ALB"},
    {title:"Listener checks in", diagram:"04 — Listener checks in", icon:"↳", plain:"A listener is like a receptionist listening for a particular kind of arrival. Port 80 is commonly HTTP; port 443 is commonly HTTPS. Listener rules can route requests based on conditions.", technical:"Listener · HTTP :80 / HTTPS :443", watch:"The gold listener card appears below the ALB. HTTPS certificates are configured on the secure listener.", status:"LISTENER RULES CHECK REQUEST"},
    {title:"Meet the target group", diagram:"05 — Meet the target group", icon:"▦", plain:"The target group is the team roster. It contains the destinations the ALB can send requests to—in this example, two EC2 web servers in separate Availability Zones.", technical:"Target group · EC2 targets", watch:"The purple target group and two server cards appear inside two Availability Zones.", status:"TWO WEB SERVERS REGISTERED"},
    {title:"Share the traffic", diagram:"06 — Share the traffic", icon:"⇄", plain:"Instead of making one server do all the work, the ALB sends requests to eligible healthy servers. The servers send their responses back through the ALB to the customer.", technical:"Load balancing · target selection", watch:"Envelope and cart packets move along the request paths; the package represents a response.", status:"DISTRIBUTING REQUESTS"},
    {title:"Check server health", diagram:"07 — Check server health", icon:"♥", plain:"The ALB checks whether targets respond as expected. If one target is unhealthy, the ALB stops sending it new requests while healthy targets remain available.", technical:"Target health checks", watch:"Use “Simulate server failure” to turn Web 1 red and watch requests use a healthy target.", status:"HEALTH CHECKS ACTIVE"},
    {title:"Add capacity", diagram:"08 — Add capacity", icon:"＋", plain:"When demand grows, an Auto Scaling Group can launch another EC2 instance. After it registers and passes health checks, the target group can send it traffic.", technical:"EC2 Auto Scaling · target registration", watch:"A third server appears in the diagram. In real AWS, scaling policies and health checks control when it receives traffic.", status:"NEW CAPACITY JOINS THE TEAM"},
    {title:"See the full picture", diagram:"09 — Complete architecture", icon:"✦", plain:"The full journey is Visitor → Route 53 → ALB → Listener → Target Group → healthy EC2 targets. Security groups restrict allowed connections, TLS can be terminated at the ALB, and CloudWatch helps monitor performance and health.", technical:"VPC · ALB · TLS · Security Groups · CloudWatch", watch:"Security and monitoring cards complete the architecture. This is a learning diagram, not a deployable AWS configuration.", status:"FULL ARCHITECTURE VISIBLE"}
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));
  const navItems = $$(".step-item");
  const reveals = $$(".reveal");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let currentStep = 0;
  let timer = null;
  let playing = !reducedMotion.matches;
  let failed = false;
  let added = false;

  const captionTitle = $("#captionTitle");
  const plainWords = $("#plainWords");
  const technicalName = $("#technicalName");
  const watchPicture = $("#watchPicture");
  const captionIcon = $("#captionIcon");

  function setPlaybackState() {
    $("#playBtn").classList.toggle("primary", playing);
    $("#playBtn").setAttribute("aria-pressed", String(playing));
    $("#pauseBtn").setAttribute("aria-pressed", String(!playing));
    if (playing) startTimer(); else stopTimer();
  }

  function startTimer() {
    stopTimer();
    if (reducedMotion.matches) return;
    timer = window.setInterval(() => showStep((currentStep + 1) % steps.length), 5000);
  }
  function stopTimer() {
    if (timer !== null) window.clearInterval(timer);
    timer = null;
  }

  function showStep(index) {
    currentStep = Math.max(0, Math.min(steps.length - 1, index));
    const step = steps[currentStep];
    $("#stepCount").textContent = `${String(currentStep + 1).padStart(2, "0")} / 09`;
    $("#captionStep").innerHTML = `${String(currentStep + 1).padStart(2, "0")}<span>/09</span>`;
    $("#progressBar").style.width = `${((currentStep + 1) / steps.length) * 100}%`;
    $("#diagramTitle").textContent = step.diagram;
    $("#flowStatus").textContent = step.status;
    captionTitle.textContent = step.title;
    plainWords.textContent = step.plain;
    technicalName.textContent = step.technical;
    watchPicture.textContent = step.watch;
    captionIcon.textContent = step.icon;

    navItems.forEach((item, i) => {
      item.classList.toggle("active", i === currentStep);
      if (i === currentStep) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });

    reveals.forEach((element) => {
      const visible = Number(element.dataset.step) <= currentStep;
      const wasVisible = element.classList.contains("visible");
      element.classList.toggle("visible", visible);
      if (visible && !wasVisible) {
        element.classList.remove("just-added");
        void element.getBoundingClientRect();
        element.classList.add("just-added");
      } else if (!visible) {
        element.classList.remove("just-added");
      }
    });

    updateFailureVisuals();
    updatePackets();
    if (playing) startTimer();
  }

  function updatePackets() {
    const request = $("#requestPacket");
    const cart = $("#cartPacket");
    const response = $("#responsePacket");
    request.style.display = currentStep >= 1 ? "" : "none";
    cart.style.display = currentStep >= 3 ? "" : "none";
    response.style.display = currentStep >= 5 ? "" : "none";
    if (failed) {
      request.style.opacity = ".95";
      cart.style.opacity = ".95";
    }
  }

  function updateFailureVisuals() {
    const serverA = $("#serverA");
    const card = serverA.querySelector("rect.server-node") || serverA.querySelector("rect");
    serverA.querySelector("rect").classList.toggle("is-failed", failed);
    serverA.querySelector(".healthA").style.display = failed ? "none" : "";
    serverA.querySelector(".failedA").style.display = failed ? "" : "none";
    $("#statusOverlay").classList.toggle("visible", failed && currentStep >= 6);
    $("#failureBtn").textContent = failed ? "✓ Restore server & run health check" : "⚡ Simulate server failure";
    $("#failureBtn").setAttribute("aria-pressed", String(failed));
    $("#failureBtn").classList.toggle("restoring", failed);
    if (failed && currentStep >= 6) {
      $("#flowStatus").textContent = "WEB 1 UNHEALTHY · ROUTING AROUND IT";
    }
    void card;
  }

  function setFailed(value) {
    failed = value;
    if (failed && currentStep < 6) {
      showStep(6);
      return;
    }
    if (!failed) {
      $("#flowStatus").textContent = steps[currentStep].status;
    }
    updateFailureVisuals();
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      playing = false;
      setPlaybackState();
      showStep(Number(item.dataset.step));
    });
  });
  $("#playBtn").addEventListener("click", () => { playing = true; setPlaybackState(); });
  $("#pauseBtn").addEventListener("click", () => { playing = false; setPlaybackState(); });
  $("#resetBtn").addEventListener("click", () => {
    playing = false;
    failed = false;
    added = false;
    setPlaybackState();
    showStep(0);
    $("#diagramFrame").scrollTo({left:0, behavior:reducedMotion.matches ? "auto" : "smooth"});
  });
  $("#failureBtn").addEventListener("click", () => {
    setFailed(!failed);
    if (failed) {
      $("#watchPicture").textContent = "Web 1 turns red; the ALB sends new requests to healthy targets.";
    } else {
      $("#watchPicture").textContent = "Web 1 is healthy again after the simulated health check succeeds.";
      $("#flowStatus").textContent = "HEALTH CHECK PASSED · SERVER RESTORED";
    }
  });
  $("#themeToggle").addEventListener("click", () => {
    const light = document.body.classList.toggle("light-theme");
    $("#themeToggle").setAttribute("aria-pressed", String(light));
    $("#themeToggle").innerHTML = light ? "☾ <span>Theme</span>" : "☼ <span>Theme</span>";
  });
  reducedMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      playing = false;
      setPlaybackState();
    }
  });

  // SVG SMIL animation is disabled for reduced-motion users; the static diagram remains readable.
  if (reducedMotion.matches) {
    $$("#movingPackets animateMotion").forEach((motion) => motion.remove());
    $$(".packet").forEach((packet) => { packet.style.display = "none"; });
  }

  showStep(0);
  setPlaybackState();
})();
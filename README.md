# Application Load Balancer Visual

**An animated, beginner-friendly AWS ALB learning lab** · `#Buildwithmayur`

A no-build, no-framework interactive diagram that follows a customer request through Ravi’s online shop. The Application Load Balancer is explained as a receptionist: it accepts web requests, checks target health, and routes traffic to suitable web servers.

> This is an educational visual simulation. It does not create AWS resources or replace AWS documentation.

## Features

- Nine guided steps with auto-play, pause, reset, and direct step selection
- Responsive layout and horizontally scrollable SVG on small screens
- Inline SVG diagram with animated request envelopes, shopping cart, and package response
- Simulated EC2 failure and recovery after a successful simulated health check
- Light/dark page theme toggle
- Reduced-motion support and keyboard-accessible native buttons
- Plain HTML, CSS, and JavaScript; no framework, dependencies, or build step

## The nine steps

1. **Visitors** — customers open Ravi’s shopping website and generate requests.
2. **DNS** — Amazon Route 53 DNS helps resolve the domain to the load balancer’s endpoint.
3. **Application Load Balancer** — the receptionist accepts incoming HTTP/HTTPS requests.
4. **Listener** — listeners receive traffic on configured ports, commonly HTTP `80` and HTTPS `443`; listener rules can route based on conditions.
5. **Target Group** — a target group registers destinations, here two EC2 web servers.
6. **Traffic Distribution** — the ALB routes requests to eligible healthy targets across Availability Zones. Responses return through the ALB.
7. **Health Checks** — an unhealthy target is marked red in the simulation; new requests are routed to healthy targets.
8. **Scaling** — a third EC2 instance appears to illustrate an Auto Scaling Group adding capacity and the target joining after registration and health checks.
9. **Complete Architecture** — visitor → Route 53 → ALB → listener → target group → healthy EC2 targets, plus security groups, TLS termination, and CloudWatch monitoring.

## AWS concepts in plain language

| Concept | Simple explanation |
|---|---|
| Application Load Balancer (ALB) | A receptionist that directs requests to the right available server. |
| Route 53 / DNS | A directory that helps a browser find a service’s address. |
| Listener | The ALB’s configured entry point for a protocol and port. |
| Listener rule | Conditions and actions used to decide how a request is routed. |
| Target group | A roster of registered destinations the ALB can send requests to. |
| Health check | A repeated test that helps determine whether a target is healthy. |
| Availability Zone | A separate location within an AWS Region, used to improve resilience. |
| Auto Scaling Group | A service that can add or remove EC2 instances based on configured conditions. |
| TLS termination | The ALB can decrypt HTTPS traffic using a configured certificate before forwarding to targets, depending on the architecture. |
| Security group | A virtual firewall that controls allowed inbound and outbound connections. |
| CloudWatch | Monitoring for metrics, logs where configured, and alarms. |

### Accuracy notes

- Route 53 does not normally return an individual EC2 server address in this design; it can route the domain to the ALB DNS name.
- An ALB forwards requests to registered, healthy targets according to its listener rules and routing algorithm; it does not promise a perfect 50/50 split.
- A target becoming unhealthy does not automatically repair the application. Recovery depends on the target passing health checks again.
- HTTPS/TLS termination requires a listener certificate and appropriate configuration. Security groups should allow only required traffic.
- Availability Zone layout, target registration, Auto Scaling behavior, and monitoring in this visual are illustrative, not live AWS state.

## Moving-object legend

- **Envelope** — incoming HTTP request
- **Shopping cart** — customer request moving toward the ALB
- **Green status / check** — healthy target
- **Red status / cross** — unhealthy target
- **Package** — server response
- **Shield** — HTTPS/TLS security
- **Chart** — CloudWatch monitoring activity

## Run locally

You only need Python 3 to serve the static files. From the project directory, run:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000> in your browser. Stop the server with `Ctrl+C`.

You can also open `index.html` directly, but a local HTTP server is recommended for a consistent browser experience.

## Publish with GitHub Pages

1. Create a GitHub repository named `application-load-balancer-visual`.
2. Upload or push the contents of this folder to the repository’s `main` branch.
3. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. Wait for the Pages deployment to finish; open the URL shown in the Pages settings.

The `.nojekyll` file helps GitHub Pages serve static project files without Jekyll processing.

## Project structure

```text
application-load-balancer-visual/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
├── .nojekyll
├── LICENSE
└── README.md
```

## Customisation

- **Lesson text and labels:** edit the `steps` array in `js/app.js`.
- **Colors, typography, layout:** adjust CSS variables near the top of `css/style.css`.
- **Diagram layout:** edit the inline SVG in `index.html`. Keep the SVG `viewBox="0 0 1100 620"` to preserve the designed coordinate system.
- **Auto-play interval:** change `5000` in `startTimer()` in `js/app.js` (milliseconds).
- **Diagram components:** reveal elements progressively with `class="reveal"` and `data-step="0"` through `data-step="8"`.
- **Branding:** search for `#Buildwithmayur` or `Buildwithmayur` and replace as desired.

## Browser support and accessibility

Use a current browser with SVG and JavaScript support. Native buttons support keyboard operation. The diagram is horizontally scrollable on narrow screens. The project respects `prefers-reduced-motion`; users can still select steps without motion.

## License

MIT. See [`LICENSE`](LICENSE).

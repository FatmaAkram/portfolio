/*
 * Entry point. Each feature is initialised in its own safe() call so one
 * failing feature (e.g. a CDN library that didn't load) can't break the rest.
 * Order matters: it matches the original inline script.
 */
import { safe } from "./utils.js";
import initTheme from "./features/theme.js";
import initTabBar from "./features/tab-bar.js";
import initOrb from "./features/orb.js";
import initHero from "./features/hero.js";
import initStream from "./demos/stream.js";
import initEntities from "./demos/entities.js";
import initShell from "./demos/shell.js";
import initTrace from "./demos/trace.js";
import initConnectors from "./demos/connectors.js";
import initOps from "./demos/ops.js";
import initStackGraph from "./features/stack-graph.js";
import initScrollMotion from "./features/scroll-motion.js";
import initMagnetic from "./features/magnetic.js";
import initCopyEmail from "./features/copy-email.js";

safe("theme", initTheme);
safe("tab", initTabBar);
safe("orb", initOrb);
safe("hero", initHero);
safe("stream", initStream);
safe("ent", initEntities);
safe("shell", initShell);
safe("trace", initTrace);
safe("cn", initConnectors);
safe("ops", initOps);
safe("stack", initStackGraph);
safe("scroll", initScrollMotion);
safe("mag", initMagnetic);
safe("copy", initCopyEmail);

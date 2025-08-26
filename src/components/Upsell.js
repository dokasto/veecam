import React, { useState, useEffect } from "react";
import { createUseStyles } from "react-jss";
import useGALogger from "../hooks/useGALogger";
import { 
  FaRocket, 
  FaVideo, 
  FaStickyNote, 
  FaSearch, 
  FaClosedCaptioning, 
  FaRobot, 
  FaLock, 
  FaGift 
} from "react-icons/fa";

const useStyles = createUseStyles({
  banner: {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "white",
    padding: "16px 20px",
    borderRadius: "8px",
    marginBottom: "24px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.3s ease",
  },
  bannerCollapsed: {
    padding: "8px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  collapsedContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: 1,
  },
  collapsedTitle: {
    fontSize: "16px",
    fontWeight: "600",
    margin: 0,
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  collapsedSubtitle: {
    fontSize: "13px",
    margin: 0,
    opacity: 0.9,
  },
  expandButton: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "500",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },
  bannerContent: {
    position: "relative",
    zIndex: 2,
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    margin: "0 0 8px 0",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
  },
  subtitle: {
    fontSize: "14px",
    margin: "0 0 12px 0",
    opacity: 0.95,
    lineHeight: "1.4",
  },
  expandedContent: {
    marginTop: "16px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
  },
  featuresIntro: {
    fontSize: "14px",
    fontWeight: "500",
    margin: "0 0 12px 0",
    opacity: 0.95,
  },
  features: {
    margin: "0 0 16px 0",
    padding: 0,
    listStyle: "none",
  },
  feature: {
    fontSize: "13px",
    margin: "0 0 8px 0",
    padding: "0 0 0 20px",
    position: "relative",
    opacity: 0.9,
    lineHeight: "1.4",
    "&:before": {
      content: '',
      position: "absolute",
      left: 0,
      top: "6px",
      width: "6px",
      height: "6px",
      borderRadius: "50%",
      backgroundColor: "#FFD700",
    },
  },
  highlight: {
    fontWeight: "700",
    color: "#FFD700",
  },
  offer: {
    background: "rgba(255, 215, 0, 0.2)",
    border: "1px solid rgba(255, 215, 0, 0.4)",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "16px",
  },
  offerTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#FFD700",
    margin: "0 0 8px 0",
  },
  offerText: {
    fontSize: "13px",
    margin: "0 0 12px 0",
    lineHeight: "1.4",
  },
  signupButton: {
    background: "#FFD700",
    color: "#333",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "#FFED4E",
      transform: "translateY(-1px)",
    },
  },
  controls: {
    position: "absolute",
    top: "12px",
    right: "12px",
    zIndex: 3,
  },
  controlButton: {
    background: "rgba(255, 255, 255, 0.2)",
    border: "none",
    color: "white",
    width: "24px",
    height: "24px",
    borderRadius: "4px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    transition: "all 0.2s ease",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.3)",
    },
  },
  backgroundPattern: {
    position: "absolute",
    top: "-50%",
    right: "-20%",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    zIndex: 1,
  },
  icon: {
    marginRight: "8px",
    verticalAlign: "middle",
    fontSize: "16px",
  },
  titleIcon: {
    marginRight: "8px",
    verticalAlign: "middle",
    fontSize: "20px",
  },
  featureIcon: {
    marginRight: "8px",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#FFD700",
  },
});

const STORAGE_KEY = 'veecam_upsell_banner_expanded';
const STRIPE_LINK = 'https://buy.stripe.com/00w7sK4045Y1aWM3fEbbG01';

export default function Upsell() {
  const classes = useStyles();
  const [isExpanded, setIsExpanded] = useState(true);
  const { logStripeLinkClick } = useGALogger();

  // Load banner state from localStorage on component mount
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY);
      if (savedState !== null) {
        setIsExpanded(JSON.parse(savedState));
      }
    } catch (error) {
      console.warn('Failed to load banner state from localStorage:', error);
    }
  }, []);

  // Save banner state to localStorage whenever it changes
  const saveBannerState = (expanded) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expanded));
    } catch (error) {
      console.warn('Failed to save banner state to localStorage:', error);
    }
  };

  const handleToggleExpand = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    saveBannerState(newExpanded);
  };

  const handleSpecialOfferClick = (e) => {
    e.preventDefault();
    logStripeLinkClick();
    window.open(STRIPE_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`${classes.banner} ${!isExpanded ? classes.bannerCollapsed : ''}`}>
      <div className={classes.backgroundPattern}></div>

      {isExpanded ? (
        <>
          <div className={classes.controls}>
            <button
              className={classes.controlButton}
              onClick={handleToggleExpand}
              title="Collapse"
            >
              -
            </button>
          </div>
          <div className={classes.bannerContent}>
            <h2 className={classes.title}>
              <FaRocket className={classes.titleIcon} />
              <span className={classes.highlight}>VeeCam</span> is Evolving!
            </h2>
            <p className={classes.subtitle}>
            After five years building video conferencing technology at Meta, I was frustrated I couldn't even adjust my own self-view to look better on calls. I built VeeCam to fix that. It started as a plugin, but user feedback made it clear: to deliver the experience people wanted, we had to own the full stack and rethink video calling from scratch.
            <br /><br />
            Now I'm building a desktop-only video conferencing app with AI running fully on-device, optimised for modern hardware. Everything runs locally, enabling better performance, strong privacy, and smarter in-call features that surpass those of Zoom or Google Meet.
            </p>

            <div className={classes.expandedContent}>
              <p className={classes.featuresIntro}>
                Here's what you get:
              </p>

              <ul className={classes.features}>
                <li className={classes.feature}>
                  <FaVideo className={classes.featureIcon} />
                  AI video enhancement with better self-view - look your best on every call
                </li>
                <li className={classes.feature}>
                  <FaStickyNote className={classes.featureIcon} />
                  Smart note-taking - automatically records what's said and identifies who said it
                </li>
                <li className={classes.feature}>
                  <FaSearch className={classes.featureIcon} />
                  Search past meeting notes - find any conversation or topic instantly
                </li>
                <li className={classes.feature}>
                  <FaClosedCaptioning className={classes.featureIcon} />
                  Close captions - real-time transcription during calls
                </li>
                <li className={classes.feature}>
                  <FaRobot className={classes.featureIcon} />
                  Smart meeting summaries - get key points and action items instantly after each call
                </li>
                <li className={classes.feature}>
                  <FaLock className={classes.featureIcon} />
                  100% private - everything runs on your computer.
                </li>
              </ul>
            </div>

            <div className={classes.offer}>
              <div className={classes.offerTitle}>
                <FaGift className={classes.icon} />
                Special Launch Offer!
              </div>
              <div className={classes.offerText}>
                We're giving our first 50 users a <strong>one-year subscription for just $15</strong>!
                You get a full refund anytime - no questions asked.
              </div>
              <a
                href="https://veecam.ai/signup"
                target="_blank"
                rel="noopener noreferrer"
                className={classes.signupButton}
                onClick={handleSpecialOfferClick}
              >
                <FaRocket className={classes.icon} />
                Claim Your Spot - $15/year
              </a>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className={classes.collapsedContent}>
            <h3 className={classes.collapsedTitle}>
              <FaRocket className={classes.titleIcon} />
              <span className={classes.highlight}>VeeCam</span> is Evolving!
            </h3>
            <p className={classes.collapsedSubtitle}>
              Better video calling with AI features - $15/year for first 50 users
            </p>
          </div>
          <button
            className={classes.expandButton}
            onClick={handleToggleExpand}
            title="Expand"
          >
            Learn More
          </button>
        </>
      )}
    </div>
  );
}
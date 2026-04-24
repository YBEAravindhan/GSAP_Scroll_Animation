import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import { useEffect } from "react";
import { IonIcon } from "@ionic/react";
import { caretDown, lockClosed } from "ionicons/icons";
import "../App.css";

const GSAPScrollAnimation = () => {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    const stickyCards = document.querySelectorAll(".card");
    const frontStickyCard = document.querySelector(".card-front");
    const backStickyCards = document.querySelectorAll(".card-back");
    const heroHeadline = document.querySelector(".hero-content");

    const stickyCardCount = backStickyCards.length;

    const CARDS_ENTER_END = 100;
    const CARD_FLIP_TRIGGER = 200;
    const CARD_DISMISS_START = 300;
    const CARD_DISMISS_DURATION = 100;

    const TOTAL_SCROLL_SVH =
      CARD_DISMISS_START + stickyCardCount * CARD_DISMISS_DURATION;

    const svhToProgress = (svh) => svh / TOTAL_SCROLL_SVH;
    const totalScroll =
      window.innerHeight * (TOTAL_SCROLL_SVH / 100);

    const cardFlipTiltAngles = [-10, -20, -5, 10];
    const cardDismissTiltAngles = [-50, -60, -45, 50];

    const cardDismissRanges = Array.from(
      { length: stickyCardCount },
      (_, i) => {
        const dismissOrder = stickyCardCount - i - 1;

        return [
          svhToProgress(
            CARD_DISMISS_START +
              dismissOrder * CARD_DISMISS_DURATION
          ),
          svhToProgress(
            CARD_DISMISS_START +
              (dismissOrder + 1) * CARD_DISMISS_DURATION
          ),
        ];
      }
    );

    gsap.set(frontStickyCard, { rotationY: 0 });
    gsap.set(backStickyCards, { rotationY: -180 });

    let isFlipped = false;

    const revealBackCards = () => {
      gsap.to(frontStickyCard, {
        rotationY: 180,
        duration: 1,
        ease: "elastic.out(1,0.5)",
      });

      backStickyCards.forEach((card, i) => {
        gsap.to(card, {
          rotationY: 0,
          rotationZ: cardFlipTiltAngles[i],
          duration: 1,
          ease: "elastic.out(1,0.5)",
        });
      });
    };

    const concealBackCards = () => {
      gsap.to(frontStickyCard, {
        rotationY: 0,
        duration: 1,
        ease: "elastic.out(1,0.5)",
      });

      backStickyCards.forEach((card) => {
        gsap.to(card, {
          rotationY: -180,
          rotationZ: 0,
          duration: 1,
          ease: "elastic.out(1,0.5)",
        });
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=${totalScroll}px`,
      pin: true,
      pinSpacing: true,
      scrub: true,

      onUpdate: ({ progress }) => {
        const enterProgress = gsap.utils.clamp(
          0,
          1,
          gsap.utils.mapRange(
            0,
            svhToProgress(CARDS_ENTER_END),
            0,
            1,
            progress
          )
        );

        gsap.set(stickyCards, {
          y: `${gsap.utils.mapRange(
            0,
            1,
            50,
            -50,
            enterProgress
          )}%`,
        });

        gsap.set(heroHeadline, {
          y: `${gsap.utils.mapRange(
            0,
            1,
            0,
            -100,
            enterProgress
          )}%`,
        });

        if (
          progress > svhToProgress(CARD_FLIP_TRIGGER) &&
          !isFlipped
        ) {
          revealBackCards();
          isFlipped = true;
        } else if (
          progress <= svhToProgress(CARD_FLIP_TRIGGER) &&
          isFlipped
        ) {
          concealBackCards();
          isFlipped = false;
        }

        // ✅ FIXED LOOP
        backStickyCards.forEach((card, i) => {
          const [dismissStart, dismissEnd] =
            cardDismissRanges[i];

          const dismissProgress = gsap.utils.clamp(
            0,
            1,
            gsap.utils.mapRange(
              dismissStart,
              dismissEnd,
              0,
              1,
              progress
            )
          );

        gsap.set(card, {
  y: `${gsap.utils.mapRange(0, 1, -20, -120, dismissProgress)}%`,
  rotation: gsap.utils.mapRange(
    0,
    1,
    cardFlipTiltAngles[i],
    cardDismissTiltAngles[i],
    dismissProgress
  ),
  opacity: gsap.utils.mapRange(0, 1, 1, 0, dismissProgress), // 👈 key
});
        });
      },
    });

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      trigger.kill();
      lenis.destroy();
      gsap.ticker.remove((time) => lenis.raf(time * 1000));
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-content">
          <h1>
            Scroll down and watch everything fall into place
          </h1>
        </div>

        <div className="sticky-cards">
          <div className="card card-front">
            <h3>First Frame</h3>
            <span>Start here</span>
            <p>
              A single moment, held in place before everything
              begins to move.
            </p>
            <div className="icon">
              <IonIcon icon={caretDown} />
            </div>
          </div>

          <div className="card card-back" id="card-1">
            <h3>Final Hold</h3>
            <div className="icon">
              <IonIcon icon={lockClosed} />
            </div>
            <p>
              Everything settles into place, leaving a lasting
              frame that feels complete
            </p>
          </div>

          <div className="card card-back" id="card-2">
            <h3>Layered Time</h3>
            <div className="icon">
              <IonIcon icon={caretDown} />
            </div>
            <p>
              Moments stack, overlap, and reveal themselves slowly
              as the scroll continues.
            </p>
          </div>

          <div className="card card-back" id="card-3">
            <h3>Weight & Flow</h3>
            <div className="icon">
              <IonIcon icon={caretDown} />
            </div>
            <p>
              Elements carry presence, easing in and out with
              balance—never rushed, never still.
            </p>
          </div>

          <div className="card card-back" id="card-4">
            <h3>Soft Motion</h3>
            <div className="icon">
              <IonIcon icon={caretDown} />
            </div>
            <p>
              Subtle shifts and gentle transitions that build a
              quiet rhythm as you move forward.
            </p>
          </div>
        </div>
      </section>

      <section className="about">
        <h3>
          A quiet progression of motion and stillness, where each
          layer reveals itself with intention and nothing feels out
          of place.
        </h3>
      </section>
    </>
  );
};

export default GSAPScrollAnimation;

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import NeonText from "@/components/NeonText";
import Fruit from "@/components/Fruit";
import MouseTrail from "@/components/MouseTrail";
import { Button } from "@/components/ui/button";

const Index = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const fruitsContainerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Realistic fruit image paths
  const fruitImages = [
    "/fruits/apple.png",
    "/fruits/orange.png",
    "/fruits/watermelon.png", 
    "/fruits/strawberry.png",
    "/fruits/kiwi.png",
    "/fruits/banana.png",
  ];
  
  // Generate positions for fruits to surround the text closely
  const generatePositions = () => {
    // Create a mix of circular and overlapping positions
    const positions = [];
    
    // Circular positions around the text
    const circleCount = 12;
    const radius = 100; // Smaller radius to keep fruits closer to text
    
    for (let i = 0; i < circleCount; i++) {
      const angle = (i / circleCount) * Math.PI * 2;
      positions.push({
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      });
    }
    
    // Add some positions directly over the text (centered with small offsets)
    for (let i = 0; i < 8; i++) {
      positions.push({
        x: (Math.random() * 160) - 80, // Position within the text width
        y: (Math.random() * 80) - 40   // Position within the text height
      });
    }
    
    return positions;
  };
  
  const fruitPositions = generatePositions();
  
  // Handle text hover to scatter fruits
  useEffect(() => {
    if (!textContainerRef.current || !fruitsContainerRef.current) return;
    
    const textElement = textContainerRef.current;
    
    const scatterFruits = () => {
      gsap.to(".fruit", {
        x: (i) => {
          const basePos = fruitPositions[i % fruitPositions.length].x;
          return basePos * 2.5; // Move outward from current position
        },
        y: (i) => {
          const basePos = fruitPositions[i % fruitPositions.length].y;
          return basePos * 2.5; // Move outward from current position
        },
        scale: 1.2,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)",
        stagger: 0.03
      });
    };
    
    const returnFruits = () => {
      gsap.to(".fruit", {
        x: (i) => fruitPositions[i % fruitPositions.length].x,
        y: (i) => fruitPositions[i % fruitPositions.length].y,
        scale: 1,
        duration: 1.2,
        ease: "elastic.out(1, 0.3)",
        stagger: 0.04
      });
    };
    
    textElement.addEventListener("mouseenter", scatterFruits);
    textElement.addEventListener("mouseleave", returnFruits);
    
    return () => {
      textElement.removeEventListener("mouseenter", scatterFruits);
      textElement.removeEventListener("mouseleave", returnFruits);
    };
  }, [fruitPositions]);

  // Handle scroll to scatter fruits
  useEffect(() => {
    const handleScroll = () => {
      if (!fruitsContainerRef.current) return;
      
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const scrollPercentage = scrollY / viewportHeight;
      
      // Apply scatter effect to fruits based on scroll position
      if (scrollPercentage > 0.1) {
        gsap.to(".fruit", {
          x: (i) => {
            return fruitPositions[i % fruitPositions.length].x + (Math.random() * 300 - 150) * scrollPercentage;
          },
          y: (i) => {
            return fruitPositions[i % fruitPositions.length].y + (Math.random() * 300 - 150) * scrollPercentage;
          },
          rotation: () => Math.random() * 360 * scrollPercentage,
          scale: () => 0.8 + Math.random() * 0.4,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.03
        });
      } else {
        gsap.to(".fruit", {
          x: (i) => fruitPositions[i % fruitPositions.length].x,
          y: (i) => fruitPositions[i % fruitPositions.length].y,
          rotation: 0,
          scale: 1,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.03
        });
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fruitPositions]);

  // Initial page load animation
  useEffect(() => {
    if (!mainRef.current || !fruitsContainerRef.current) return;
    
    // Initialize GSAP animations
    const tl = gsap.timeline({ 
      onComplete: () => setIsLoaded(true) 
    });
    
    // Background fade in
    tl.fromTo(
      mainRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1.5, ease: "power2.inOut" }
    );

    // Position fruits around the text initially
    gsap.set(".fruit", {
      x: (i) => fruitPositions[i % fruitPositions.length].x,
      y: (i) => fruitPositions[i % fruitPositions.length].y,
      opacity: 0,
      scale: 0
    });
    
    // Animate fruits in
    tl.to(".fruit", {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.05,
      ease: "back.out(1.7)"
    }, "-=1");
    
    // Add a dark overlay initially that fades out
    const overlay = document.createElement("div");
    overlay.className = "absolute inset-0 bg-black z-50";
    document.body.appendChild(overlay);
    
    tl.to(overlay, {
      opacity: 0, 
      duration: 1.5, 
      ease: "power2.inOut",
      onComplete: () => overlay.remove()
    }, "-=1");
    
    return () => {
      overlay.remove();
      tl.kill();
    };
  }, [fruitPositions]);
  
  // Create a slicing effect when clicking on fruits
  const handleSliceClick = () => {
    gsap.to(".fruit", {
      x: (i) => fruitPositions[i % fruitPositions.length].x + (Math.random() * 500 - 250),
      y: (i) => fruitPositions[i % fruitPositions.length].y + (Math.random() * 500 - 250),
      rotation: () => Math.random() * 720 - 360,
      scale: () => 0.7 + Math.random() * 0.6,
      opacity: 0.7,
      duration: 0.8,
      ease: "power3.out",
      stagger: 0.02,
      onComplete: () => {
        // Return to original positions with delay
        gsap.to(".fruit", {
          x: (i) => fruitPositions[i % fruitPositions.length].x,
          y: (i) => fruitPositions[i % fruitPositions.length].y,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)",
          stagger: 0.04,
          delay: 0.5
        });
      }
    });
  };
  
  return (
    <div 
      ref={mainRef}
      className="min-h-screen w-full overflow-x-hidden bg-[#120E29] flex flex-col items-center justify-center relative py-20"
    >
      {/* Mouse trail effect */}
      <MouseTrail />
      
      {/* Neon grid background with stronger glow */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-[50vh] bg-gradient-to-t from-neon-purple/40 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[30vh] bg-gradient-to-b from-neon-blue/40 to-transparent"></div>
        
        {/* Enhanced animated neon background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-pink/20 blur-[120px] animate-pulse-glow"></div>
          <div className="absolute top-2/3 right-1/4 w-[500px] h-[500px] rounded-full bg-neon-blue/20 blur-[100px] animate-pulse-glow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-neon-green/20 blur-[80px] animate-pulse-glow"></div>
        </div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Main Content */}
        <div className="flex flex-col items-center justify-center z-10">
          {/* Title */}
          <div className="text-center mb-16 relative">
            <div 
              ref={textContainerRef} 
              className="relative z-20 cursor-pointer inline-block py-6 px-10"
            >
              <div className="flex flex-col items-center">
                <div className="mb-2 text-neon-orange">
                  <NeonText 
                    text="ARCADE" 
                    color="#FF9900" 
                    className="text-xl md:text-2xl font-['Press_Start_2P']"
                  />
                </div>
                <div className="relative">
                  <NeonText 
                    text="FRUIT" 
                    color="white" 
                    glowColor="#FF00FF" 
                    flickering={true}
                    className="text-5xl md:text-7xl lg:text-8xl font-['Bungee_Outline'] tracking-widest text-white"
                  />
                  <NeonText 
                    text="NINJA" 
                    color="white" 
                    glowColor="#00FFFF"
                    flickering={true}
                    className="text-5xl md:text-7xl lg:text-8xl font-['Bungee_Outline'] tracking-widest text-white"
                  />
                </div>
              </div>
            </div>
            
            {/* Fruit container positioned over the text */}
            <div 
              ref={fruitsContainerRef}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px]"
            >
              {fruitPositions.map((position, index) => (
                <Fruit
                  key={index}
                  imageSrc={fruitImages[index % fruitImages.length]}
                  initialPosition={position}
                  size={index % 3 === 0 ? "lg" : index % 3 === 1 ? "md" : "sm"}
                  delay={index * 0.05}
                  rotation={Math.random() * 360}
                />
              ))}
            </div>
          </div>
          
          {/* Slice button */}
          <div className="text-center mt-40">
            <Button
              onClick={handleSliceClick}
              className="bg-gradient-to-r from-neon-pink to-neon-blue hover:from-neon-blue hover:to-neon-pink text-white text-lg py-2 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-[0_0_10px_rgba(255,0,255,0.7),0_0_20px_rgba(0,255,255,0.5)] border border-white/20 backdrop-blur-sm"
            >
              SLICE!
            </Button>
            <p className="mt-8 text-white max-w-md mx-auto">
              Hover over the "FRUIT NINJA" text to scatter fruits! 
              Scroll down or click the SLICE button to see more effects.
            </p>
          </div>
        </div>
        
        {/* Spacer for scroll effects */}
        <div className="h-[100vh]"></div>
      </div>
    </div>
  );
};

export default Index;

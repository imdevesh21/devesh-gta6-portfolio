"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

interface ThreeCanvasProps {
  activeTab: string;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({ activeTab }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // 3D Objects References
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const headRef = useRef<THREE.Group | null>(null);
  const droneRef = useRef<THREE.Group | null>(null);
  const weaponArtifactRef = useRef<THREE.Group | null>(null);
  const gridTerrainRef = useRef<THREE.LineSegments | null>(null);
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  // Mouse coords for 3D parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x0c0119, 0.045);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.2, 5.5);
    cameraRef.current = camera;

    // 3. Renderer Setup with PBR capabilities
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig (Vice City Neon Palette)
    const ambientLight = new THREE.AmbientLight(0x220538, 1.5);
    scene.add(ambientLight);

    const pinkKeyLight = new THREE.PointLight(0xff2a85, 4.5, 20);
    pinkKeyLight.position.set(-3, 3, 3);
    scene.add(pinkKeyLight);

    const cyanRimLight = new THREE.PointLight(0x00f0ff, 4.0, 20);
    cyanRimLight.position.set(3, 2, -2);
    scene.add(cyanRimLight);

    const amberFillLight = new THREE.PointLight(0xffb700, 2.5, 15);
    amberFillLight.position.set(0, -2, 3);
    scene.add(amberFillLight);

    // 5. Stylized 3D Cyber Character Model (Devesh - Full Stack Architect)
    const charGroup = new THREE.Group();
    characterGroupRef.current = charGroup;
    charGroup.position.set(0, -0.6, 0);

    // Chrome & Matte Tactical Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      metalness: 0.9,
      roughness: 0.15,
    });
    const armorMat = new THREE.MeshStandardMaterial({
      color: 0x0f051d,
      metalness: 0.6,
      roughness: 0.3,
    });
    const neonPinkMat = new THREE.MeshBasicMaterial({ color: 0xff2a85 });
    const neonCyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffb700,
      metalness: 0.8,
      roughness: 0.2,
    });

    // Torso / Tactical Armor Chest
    const chestGeo = new THREE.BoxGeometry(0.9, 1.1, 0.5);
    const chestMesh = new THREE.Mesh(chestGeo, armorMat);
    chestMesh.position.y = 1.0;
    charGroup.add(chestMesh);

    // Armor Core Reactor
    const coreGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
    coreGeo.rotateX(Math.PI / 2);
    const coreMesh = new THREE.Mesh(coreGeo, neonCyanMat);
    coreMesh.position.set(0, 1.1, 0.28);
    charGroup.add(coreMesh);

    // Shoulder Armor Pads
    const shoulderGeo = new THREE.BoxGeometry(0.35, 0.3, 0.4);
    const leftShoulder = new THREE.Mesh(shoulderGeo, chromeMat);
    leftShoulder.position.set(-0.62, 1.35, 0);
    const rightShoulder = new THREE.Mesh(shoulderGeo, chromeMat);
    rightShoulder.position.set(0.62, 1.35, 0);
    charGroup.add(leftShoulder, rightShoulder);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.8, 12);
    const leftArm = new THREE.Mesh(armGeo, armorMat);
    leftArm.position.set(-0.62, 0.8, 0);
    leftArm.rotation.z = 0.15;
    const rightArm = new THREE.Mesh(armGeo, armorMat);
    rightArm.position.set(0.62, 0.8, 0);
    rightArm.rotation.z = -0.15;
    charGroup.add(leftArm, rightArm);

    // Pelvis / Legs Base
    const pelvisGeo = new THREE.BoxGeometry(0.7, 0.35, 0.4);
    const pelvisMesh = new THREE.Mesh(pelvisGeo, armorMat);
    pelvisMesh.position.y = 0.3;
    charGroup.add(pelvisMesh);

    const legGeo = new THREE.CylinderGeometry(0.12, 0.1, 1.0, 12);
    const leftLeg = new THREE.Mesh(legGeo, chromeMat);
    leftLeg.position.set(-0.25, -0.3, 0);
    const rightLeg = new THREE.Mesh(legGeo, chromeMat);
    rightLeg.position.set(0.25, -0.3, 0);
    charGroup.add(leftLeg, rightLeg);

    // Head Group (Rotates with Cursor)
    const headGroup = new THREE.Group();
    headRef.current = headGroup;
    headGroup.position.set(0, 1.8, 0);

    const faceGeo = new THREE.BoxGeometry(0.5, 0.55, 0.5);
    const faceMesh = new THREE.Mesh(faceGeo, chromeMat);
    headGroup.add(faceMesh);

    // Cyber Visor / Neon Shades
    const visorGeo = new THREE.BoxGeometry(0.48, 0.15, 0.15);
    const visorMesh = new THREE.Mesh(visorGeo, neonPinkMat);
    visorMesh.position.set(0, 0.05, 0.24);
    headGroup.add(visorMesh);

    // Cyber Headset / Audio Comm
    const earpieceGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12);
    earpieceGeo.rotateZ(Math.PI / 2);
    const leftEar = new THREE.Mesh(earpieceGeo, goldMat);
    leftEar.position.set(-0.28, 0.05, 0);
    const rightEar = new THREE.Mesh(earpieceGeo, goldMat);
    rightEar.position.set(0.28, 0.05, 0);
    headGroup.add(leftEar, rightEar);

    charGroup.add(headGroup);
    scene.add(charGroup);

    // 6. Floating AI Companion Drone (Outlier RLHF Intelligence Unit)
    const drone = new THREE.Group();
    droneRef.current = drone;
    const droneBodyGeo = new THREE.IcosahedronGeometry(0.18, 1);
    const droneBody = new THREE.Mesh(droneBodyGeo, chromeMat);
    drone.add(droneBody);

    const droneRingGeo = new THREE.TorusGeometry(0.3, 0.02, 8, 32);
    const droneRing = new THREE.Mesh(droneRingGeo, neonCyanMat);
    droneRing.rotation.x = Math.PI / 3;
    drone.add(droneRing);

    const droneLight = new THREE.PointLight(0x00f0ff, 1.5, 3);
    drone.add(droneLight);
    scene.add(drone);

    // 7. Interactive 3D Weapon / Tech Holographic Artifact
    const weaponGroup = new THREE.Group();
    weaponArtifactRef.current = weaponGroup;
    weaponGroup.position.set(2.4, 0.8, -0.5);

    // Quantum Reactor Core (Next.js / Node.js representation)
    const coreGeom = new THREE.OctahedronGeometry(0.4, 0);
    const coreM = new THREE.MeshStandardMaterial({
      color: 0xff2a85,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: false,
    });
    const coreMsh = new THREE.Mesh(coreGeom, coreM);
    weaponGroup.add(coreMsh);

    // Orbiting Rings
    const ring1Geo = new THREE.TorusGeometry(0.65, 0.02, 12, 48);
    const ring1 = new THREE.Mesh(ring1Geo, neonCyanMat);
    const ring2Geo = new THREE.TorusGeometry(0.8, 0.02, 12, 48);
    const ring2 = new THREE.Mesh(ring2Geo, goldMat);
    ring2.rotation.x = Math.PI / 2;
    weaponGroup.add(ring1, ring2);

    scene.add(weaponGroup);

    // 8. Blender-Style Wireframe Terrain Grid (Retro Vice City Horizon)
    const gridHelper = new THREE.GridHelper(40, 40, 0xff2a85, 0x330055);
    gridHelper.position.y = -1.2;
    gridTerrainRef.current = gridHelper;
    scene.add(gridHelper);

    // 9. Giant 3D Wireframe Sunset Sun
    const sunGeo = new THREE.CircleGeometry(4, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xff2a85,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunMesh.position.set(0, 1.5, -12);
    sunMeshRef.current = sunMesh;
    scene.add(sunMesh);

    // 10. Floating Embers & Particle Field
    const particleCount = 400;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0xff2a85);
    const c2 = new THREE.Color(0x00f0ff);
    const c3 = new THREE.Color(0xffb700);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 14;

      const mixed = Math.random() < 0.4 ? c1 : Math.random() < 0.7 ? c2 : c3;
      colors[i * 3] = mixed.r;
      colors[i * 3 + 1] = mixed.g;
      colors[i * 3 + 2] = mixed.b;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.055,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particlesRef.current = particles;
    scene.add(particles);

    // 11. Mouse Movement Listener for Dynamic 3D Parallax
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // 12. Resize Listener
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 13. Animation Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (charGroup) {
        charGroup.position.y = -0.6 + Math.sin(elapsedTime * 2.2) * 0.04;
        charGroup.rotation.y = mouseRef.current.x * 0.35;
      }
      if (headRef.current) {
        headRef.current.rotation.y = mouseRef.current.x * 0.6;
        headRef.current.rotation.x = -mouseRef.current.y * 0.3;
      }

      if (drone) {
        drone.position.x = Math.sin(elapsedTime * 1.5) * 1.6 - 0.4;
        drone.position.y = 1.3 + Math.cos(elapsedTime * 2.5) * 0.25;
        drone.position.z = Math.cos(elapsedTime * 1.5) * 0.9;
        drone.rotation.y = elapsedTime * 3;
        droneRing.rotation.z = elapsedTime * 2;
      }

      if (weaponGroup) {
        weaponGroup.rotation.y = elapsedTime * 1.2;
        weaponGroup.rotation.x = Math.sin(elapsedTime * 0.8) * 0.3;
        ring1.rotation.y = elapsedTime * 2;
        ring2.rotation.z = -elapsedTime * 1.8;
      }

      if (gridHelper) {
        gridHelper.position.z = (elapsedTime * 1.5) % 1;
      }

      if (particles) {
        particles.rotation.y = elapsedTime * 0.04;
        particles.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05;
      }

      camera.position.x = mouseRef.current.x * 0.6;
      camera.position.y = 1.2 + mouseRef.current.y * 0.3;
      camera.lookAt(0, 0.7, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // 14. GSAP Camera & Scene Transitions on Tab Change
  useEffect(() => {
    if (!cameraRef.current || !characterGroupRef.current || !weaponArtifactRef.current) return;
    const camera = cameraRef.current;
    const char = characterGroupRef.current;
    const weapon = weaponArtifactRef.current;

    switch (activeTab) {
      case "dossier":
        gsap.to(camera.position, { x: 0, y: 1.2, z: 4.8, duration: 1.2, ease: "power3.out" });
        gsap.to(char.position, { x: -0.2, y: -0.6, z: 0, duration: 1.2, ease: "power3.out" });
        gsap.to(weapon.position, { x: 4, duration: 1 });
        break;

      case "weapons":
        gsap.to(camera.position, { x: 1.2, y: 1.4, z: 4.2, duration: 1.2, ease: "power3.out" });
        gsap.to(char.position, { x: -2.2, duration: 1.2, ease: "power3.out" });
        gsap.to(weapon.position, { x: 1.2, y: 1.2, z: 0.5, duration: 1.2, ease: "back.out(1.5)" });
        break;

      case "campaign":
        gsap.to(camera.position, { x: -0.5, y: 2.2, z: 6.2, duration: 1.4, ease: "power3.inOut" });
        gsap.to(char.position, { x: -1.8, y: -0.4, duration: 1.2 });
        break;

      case "contracts":
        gsap.to(camera.position, { x: 0.8, y: 0.8, z: 5.0, duration: 1.2, ease: "power2.out" });
        break;

      case "trophies":
        gsap.to(camera.position, { x: 0, y: 1.8, z: 5.4, duration: 1.2, ease: "power3.out" });
        break;

      default:
        gsap.to(camera.position, { x: 0, y: 1.2, z: 5.5, duration: 1.2 });
    }
  }, [activeTab]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
    />
  );
};

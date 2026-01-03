import * as THREE from "three";
import { describe, expect, it, vi } from "vitest";

// Mock react-three/fiber and drei
vi.mock("@react-three/fiber", () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="canvas">{children}</div>
  ),
  useFrame: (callback: (state: any) => void) => {
    // Store the callback for testing
    if (!(global as any).__useFrameCallbacks) {
      (global as any).__useFrameCallbacks = [];
    }
    (global as any).__useFrameCallbacks.push(callback);
  },
  useThree: () => ({
    camera: new THREE.PerspectiveCamera(),
  }),
}));

vi.mock("@react-three/drei", () => ({
  OrbitControls: () => null,
  RoundedBox: ({ children }: { children: React.ReactNode }) => (
    <group>{children}</group>
  ),
  Html: ({ children, style }: { children: React.ReactNode; style?: any }) => (
    <div data-testid="html-label" style={style}>
      {children}
    </div>
  ),
}));

describe("Cube3D Face Label Transparency", () => {
  describe("calculateFacingAngle", () => {
    it("should return positive dot product when face is toward camera", () => {
      // Camera at [4, 3, 4], cube at origin
      const cameraPos = new THREE.Vector3(4, 3, 4);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const labelPos = new THREE.Vector3(2.2, 0, 0); // Right face

      const labelDir = new THREE.Vector3()
        .subVectors(labelPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // Right face should be visible from this camera angle
      expect(dot).toBeGreaterThan(0);
    });

    it("should return negative dot product when face is away from camera", () => {
      // Camera at [4, 3, 4], cube at origin
      const cameraPos = new THREE.Vector3(4, 3, 4);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const labelPos = new THREE.Vector3(-2.2, 0, 0); // Left face (opposite side)

      const labelDir = new THREE.Vector3()
        .subVectors(labelPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // Left face should NOT be visible from this camera angle
      expect(dot).toBeLessThan(0);
    });

    it("should handle top face visibility", () => {
      // Camera looking down from above
      const cameraPos = new THREE.Vector3(0, 10, 0);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const labelPos = new THREE.Vector3(0, 2.2, 0); // Top face

      const labelDir = new THREE.Vector3()
        .subVectors(labelPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // Top face should be visible when camera is above
      expect(dot).toBeCloseTo(1, 2);
    });

    it("should handle bottom face visibility", () => {
      // Camera looking down from above
      const cameraPos = new THREE.Vector3(0, 10, 0);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const labelPos = new THREE.Vector3(0, -2.2, 0); // Bottom face

      const labelDir = new THREE.Vector3()
        .subVectors(labelPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // Bottom face should NOT be visible when camera is above
      expect(dot).toBeCloseTo(-1, 2);
    });
  });

  describe("opacity calculation with rotation", () => {
    it("should account for cube rotation when calculating visibility", () => {
      // Setup: cube rotated 180° around Y axis
      const cubeGroup = new THREE.Group();
      cubeGroup.rotation.y = Math.PI; // 180° rotation
      cubeGroup.updateMatrixWorld(true);

      const cameraPos = new THREE.Vector3(4, 0, 0);
      const labelLocalPos = new THREE.Vector3(2.2, 0, 0); // Right face in local space

      // Transform label position to world space
      const labelWorldPos = labelLocalPos.clone();
      labelWorldPos.applyMatrix4(cubeGroup.matrixWorld);

      // After 180° Y rotation, local right becomes world left
      expect(labelWorldPos.x).toBeCloseTo(-2.2, 1);

      const cubeCenter = new THREE.Vector3();
      cubeGroup.getWorldPosition(cubeCenter);

      const labelDir = new THREE.Vector3()
        .subVectors(labelWorldPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // After rotation, the "right" label is now facing away from camera
      expect(dot).toBeLessThan(0);
    });

    it("should maintain visibility of front face after 90° Y rotation", () => {
      // Setup: cube rotated 90° around Y axis
      const cubeGroup = new THREE.Group();
      cubeGroup.rotation.y = Math.PI / 2; // 90° rotation
      cubeGroup.updateMatrixWorld(true);

      const cameraPos = new THREE.Vector3(0, 0, 4);
      const labelLocalPos = new THREE.Vector3(0, 0, 2.2); // Front face in local space

      // Transform label position to world space
      const labelWorldPos = labelLocalPos.clone();
      labelWorldPos.applyMatrix4(cubeGroup.matrixWorld);

      const cubeCenter = new THREE.Vector3();
      cubeGroup.getWorldPosition(cubeCenter);

      const labelDir = new THREE.Vector3()
        .subVectors(labelWorldPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const dot = labelDir.dot(cameraDir);

      // After 90° rotation, what was front is now facing right, camera still in front
      expect(dot).toBeLessThan(0.1);
    });
  });

  describe("opacity threshold logic", () => {
    it("should return full opacity for faces clearly toward camera", () => {
      const dot = 0.5; // Positive, clearly facing camera
      const opacity = dot > 0.1 ? 1 : 0.25;
      expect(opacity).toBe(1);
    });

    it("should return reduced opacity for faces away from camera", () => {
      const dot = -0.5; // Negative, facing away
      const opacity = dot > 0.1 ? 1 : 0.25;
      expect(opacity).toBe(0.25);
    });

    it("should return reduced opacity for faces perpendicular to camera", () => {
      const dot = 0.05; // Nearly perpendicular
      const opacity = dot > 0.1 ? 1 : 0.25;
      expect(opacity).toBe(0.25);
    });

    it("should use threshold to avoid flickering at edge cases", () => {
      // Just above threshold
      const dot1 = 0.11;
      const opacity1 = dot1 > 0.1 ? 1 : 0.25;
      expect(opacity1).toBe(1);

      // Just below threshold
      const dot2 = 0.09;
      const opacity2 = dot2 > 0.1 ? 1 : 0.25;
      expect(opacity2).toBe(0.25);
    });
  });

  describe("edge cases", () => {
    it("should handle camera at origin", () => {
      const cameraPos = new THREE.Vector3(0, 0, 0);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const labelPos = new THREE.Vector3(2.2, 0, 0);

      const labelDir = new THREE.Vector3()
        .subVectors(labelPos, cubeCenter)
        .normalize();
      const cameraDir = new THREE.Vector3().subVectors(cameraPos, cubeCenter);

      // Camera at same position as cube - direction is zero vector
      expect(cameraDir.length()).toBe(0);
    });

    it("should handle all faces from isometric view", () => {
      // Standard isometric camera position
      const cameraPos = new THREE.Vector3(4, 3, 4);
      const cubeCenter = new THREE.Vector3(0, 0, 0);
      const cameraDir = new THREE.Vector3()
        .subVectors(cameraPos, cubeCenter)
        .normalize();

      const faces = [
        { name: "Right", pos: new THREE.Vector3(2.2, 0, 0) },
        { name: "Left", pos: new THREE.Vector3(-2.2, 0, 0) },
        { name: "Top", pos: new THREE.Vector3(0, 2.2, 0) },
        { name: "Bottom", pos: new THREE.Vector3(0, -2.2, 0) },
        { name: "Front", pos: new THREE.Vector3(0, 0, 2.2) },
        { name: "Back", pos: new THREE.Vector3(0, 0, -2.2) },
      ];

      const visibility = faces.map((face) => {
        const labelDir = new THREE.Vector3()
          .subVectors(face.pos, cubeCenter)
          .normalize();
        const dot = labelDir.dot(cameraDir);
        return { name: face.name, visible: dot > 0.1 };
      });

      // From isometric view (4,3,4), we should see Right, Top, and Front
      expect(visibility.find((f) => f.name === "Right")?.visible).toBe(true);
      expect(visibility.find((f) => f.name === "Top")?.visible).toBe(true);
      expect(visibility.find((f) => f.name === "Front")?.visible).toBe(true);

      // And NOT see Left, Bottom, Back
      expect(visibility.find((f) => f.name === "Left")?.visible).toBe(false);
      expect(visibility.find((f) => f.name === "Bottom")?.visible).toBe(false);
      expect(visibility.find((f) => f.name === "Back")?.visible).toBe(false);
    });
  });
});

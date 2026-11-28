import { test, expect } from "@playwright/test";
import { makeBody, stepBodies, type World } from "../src/components/ui/footer-critter-scene";

for (const fps of [30, 60]) {
  test(`hop rebounds several times and settles at ${fps} fps`, () => {
    const world: World = { w: 900, h: 250, floor: 20, gravity: 2600, bounce: .62 };
    const body = { ...makeBody(45), x: 450, y: 65, vy: 700, live: true };
    const rebounds: number[] = [];
    const dt = 1 / fps, steps = Math.ceil(dt * 180);
    for (let frame = 0; frame < fps * 6; frame++) {
      for (let i = 0; i < steps; i++) {
        const incoming = body.vy;
        stepBodies([body], world, dt / steps, null);
        if (incoming < 0 && body.vy > 0) rebounds.push(body.vy);
        expect(body.y).toBeGreaterThanOrEqual(world.floor + body.r);
      }
    }
    expect(rebounds.length).toBeGreaterThanOrEqual(3);
    expect(rebounds.length).toBeLessThan(10);
    rebounds.slice(1).forEach((speed, i) => expect(speed).toBeLessThan(rebounds[i]));
    expect(body.vy).toBe(0);
    expect(body.onFloor).toBe(true);
    expect(body.y).toBe(world.floor + body.r);
  });
}

test("a wall collision redirects a moving character without adding speed", () => {
  const world: World = { w: 300, h: 250, floor: 20, gravity: 2600, bounce: .62 };
  const body = { ...makeBody(40), x: 259, y: 130, vx: 300, live: true };
  stepBodies([body], world, 1 / 180, null);
  expect(body.x).toBeLessThanOrEqual(world.w - body.wall);
  expect(body.vx).toBeLessThan(0);
  expect(Math.abs(body.vx)).toBeLessThan(300);
});

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useState } from "react";
import Image from "next/image";
import BobotSocket from "@/lib/socket/connect";

export default function Home() {
  const [socketUrl, setSocketUrl] = useState("");

  let socket: BobotSocket | null = null;

  const initializeSocket = async () => {
    socket = new BobotSocket(socketUrl);
    socket.addEventListeners();
  };

  return (
    <>
      <div className="absolute mt-4 ml-4">
        <ModeToggle />
      </div>
      <div className="min-h-screen grid items-center bg-background overflow-hidden">
        <div className="p-4 flex flex-col gap-4 w-[70%] h-full mx-auto">
          <div className="min-h-max font-[family-name:var(--font-geist-sans)] grow-0">
            <div className="flex flex-row justify-center gap-2">
              <Input
                type="text"
                placeholder="Websocket url..."
                className="inline"
                value={socketUrl}
                onChange={(e) => setSocketUrl(e.target.value)}
              />
              <Button className="inline" onClick={initializeSocket}>
                Connect
              </Button>
            </div>
          </div>
          <div className="border bg-background shadow-xs dark:bg-input/30 dark:border-input rounded-(--radius-lg) p-4 min-h-max grow overflow-y-scroll"></div>
        </div>
      </div>
    </>
  );
}

import { toast } from "sonner";

class BobotSocket {
  private socket: WebSocket;

  constructor(url: string) {
    this.socket = new WebSocket(url);
  }

  addEventListeners() {
    this.socket.addEventListener("open", (event) => {
      toast.success("Connected to Bobot!");
      this.socket.send("Hello Bobot!");
    });

    this.socket.addEventListener("message", (event) => {
      const data = event.data;
    });

    this.socket.addEventListener("error", (event) => {
      toast.error("Error connecting to Bobot!");
    });
  }

  send(data: string) {
    this.socket.send(data);
  }

  close() {
    this.socket.close();
  }
}

export default BobotSocket;

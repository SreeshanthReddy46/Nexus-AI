import { NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Spawn python child process
    const scriptPath = path.join(process.cwd(), "src", "agents", "agent_engine.py");
    
    return new Promise<Response>((resolve) => {
      const pyProcess = spawn("python", [scriptPath]);
      
      let stdoutData = "";
      let stderrData = "";
      
      // Write payload to python stdin
      pyProcess.stdin.write(JSON.stringify(body));
      pyProcess.stdin.end();
      
      pyProcess.stdout.on("data", (data) => {
        stdoutData += data.toString();
      });
      
      pyProcess.stderr.on("data", (data) => {
        stderrData += data.toString();
      });
      
      pyProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}.`);
          // Graceful fallback response on Python execution failure
          resolve(NextResponse.json({
            text: "An error occurred while running the Python agent engine.",
            confidence: "0%",
            sources: [],
            relations: [],
            trace: [
              { agent: "Python Runner", status: "warning", details: `Engine execution failed with code ${code}.` }
            ],
            agent_type: "Research Agent"
          }));
          return;
        }
        
        try {
          const parsed = jsonParseSafe(stdoutData);
          resolve(NextResponse.json(parsed));
        } catch (e) {
          console.error("Failed to parse Python stdout.");
          resolve(NextResponse.json({
            text: "Failed to parse Python agent output.",
            confidence: "0%",
            sources: [],
            relations: [],
            trace: [
              { agent: "Python Parser", status: "warning", details: "Output formatting error." }
            ],
            agent_type: "Research Agent"
          }));
        }
      });
    });
  } catch (err: any) {
    console.error("API Agent route error.");
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function jsonParseSafe(str: string) {
  // Extract JSON block in case python prints warnings or other texts
  const jsonStart = str.indexOf("{");
  const jsonEnd = str.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd >= jsonStart) {
    const rawJson = str.substring(jsonStart, jsonEnd + 1);
    return JSON.parse(rawJson);
  }
  return JSON.parse(str);
}

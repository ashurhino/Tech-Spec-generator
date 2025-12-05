import subprocess
import os
from pathlib import Path

def run_kiro_chat(kiro_file: str):
    """
    Executes: kiro-cli chat with content from kiro_file in headless mode
    Uses specifications from .kiro/specs/ and steering rules from .kiro/steering/
    """

    kiro_file = Path(kiro_file).resolve()
    if not kiro_file.exists():
        raise FileNotFoundError(f".kiro file not found: {kiro_file}")

    # Read the prompt from the kiro file
    with open(kiro_file, 'r') as f:
        prompt = f.read().strip()

    # Add ~/.local/bin to PATH for kiro-cli
    env = os.environ.copy()
    local_bin = os.path.expanduser("~/.local/bin")
    env["PATH"] = f"{local_bin}:{env.get('PATH', '')}"

    # Use --no-interactive flag for headless execution and --trust-all-tools to avoid confirmations
    cmd = ["kiro-cli", "chat", "--no-interactive", "--trust-all-tools", prompt]

    print(f"Running: kiro-cli chat --no-interactive --trust-all-tools")
    print(f"Using specifications from: .kiro/specs/")
    print(f"Using steering rules from: .kiro/steering/")
    print("-" * 60)

    process = subprocess.Popen(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        bufsize=1,
        env=env
    )

    # Stream output in real-time
    for line in process.stdout:
        print(line, end="")

    # Capture remaining output
    stdout, stderr = process.communicate()

    return process.returncode, stdout, stderr


# Example usage:
if __name__ == "__main__":
    exit_code, out, err = run_kiro_chat("module.kiro")
    print("\n" + "=" * 60)
    print("Exit Code:", exit_code)
    if err:
        print("STDERR:", err)

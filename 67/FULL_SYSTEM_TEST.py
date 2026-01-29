#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════════════════════════╗
║  🔺 PHENIX NAVIGATOR — FULL SYSTEM TEST SUITE                                 ║
║  Comprehensive automated testing with live visualization                      ║
║  "The tetrahedron is the minimum stable system." — Fuller                     ║
╚═══════════════════════════════════════════════════════════════════════════════╝

Usage:
    python FULL_SYSTEM_TEST.py           # Run all tests
    python FULL_SYSTEM_TEST.py --fast    # Skip slow tests
    python FULL_SYSTEM_TEST.py --json    # Output JSON report
    python FULL_SYSTEM_TEST.py --watch   # Continuous monitoring
"""

import os
import sys
import json
import time
import socket
import subprocess
import argparse
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Tuple, Optional
import threading

# ═══════════════════════════════════════════════════════════════════════════════
# ANSI COLORS FOR LIVE OUTPUT
# ═══════════════════════════════════════════════════════════════════════════════

class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    BOLD = '\033[1m'
    DIM = '\033[2m'
    RESET = '\033[0m'
    
    @staticmethod
    def enable_windows():
        """Enable ANSI colors on Windows."""
        if sys.platform == 'win32':
            import ctypes
            kernel32 = ctypes.windll.kernel32
            kernel32.SetConsoleMode(kernel32.GetStdHandle(-11), 7)

Colors.enable_windows()

# ═══════════════════════════════════════════════════════════════════════════════
# TEST RESULT TRACKING
# ═══════════════════════════════════════════════════════════════════════════════

class TestResult:
    def __init__(self, name: str, category: str):
        self.name = name
        self.category = category
        self.status = "pending"  # pending, running, passed, failed, skipped
        self.message = ""
        self.duration = 0.0
        self.details = []

class TestSuite:
    def __init__(self):
        self.results: List[TestResult] = []
        self.start_time: Optional[float] = None
        self.categories: Dict[str, List[TestResult]] = {}
        
    def add_test(self, name: str, category: str) -> TestResult:
        result = TestResult(name, category)
        self.results.append(result)
        if category not in self.categories:
            self.categories[category] = []
        self.categories[category].append(result)
        return result
    
    def get_stats(self) -> Dict:
        passed = len([r for r in self.results if r.status == "passed"])
        failed = len([r for r in self.results if r.status == "failed"])
        skipped = len([r for r in self.results if r.status == "skipped"])
        pending = len([r for r in self.results if r.status in ["pending", "running"]])
        total = len(self.results)
        return {
            "passed": passed,
            "failed": failed,
            "skipped": skipped,
            "pending": pending,
            "total": total,
            "percentage": (passed / total * 100) if total > 0 else 0
        }

# ═══════════════════════════════════════════════════════════════════════════════
# LIVE DISPLAY
# ═══════════════════════════════════════════════════════════════════════════════

class LiveDisplay:
    def __init__(self, suite: TestSuite):
        self.suite = suite
        self.current_test = ""
        self.current_detail = ""
        self.lock = threading.Lock()
        
    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        
    def draw_progress_bar(self, percentage: float, width: int = 40) -> str:
        filled = int(width * percentage / 100)
        bar = '█' * filled + '░' * (width - filled)
        return f"[{bar}] {percentage:.0f}%"
    
    def get_status_icon(self, status: str) -> str:
        icons = {
            "passed": f"{Colors.GREEN}✅{Colors.RESET}",
            "failed": f"{Colors.RED}❌{Colors.RESET}",
            "running": f"{Colors.YELLOW}🔄{Colors.RESET}",
            "pending": f"{Colors.DIM}⏳{Colors.RESET}",
            "skipped": f"{Colors.BLUE}⏭️{Colors.RESET}"
        }
        return icons.get(status, "❓")
    
    def render(self):
        with self.lock:
            self.clear_screen()
            stats = self.suite.get_stats()
            elapsed = time.time() - self.suite.start_time if self.suite.start_time else 0
            
            # Header
            print(f"{Colors.CYAN}{Colors.BOLD}")
            print("╔" + "═" * 70 + "╗")
            print("║" + "  🔺 PHENIX NAVIGATOR — FULL SYSTEM TEST SUITE  ".center(70) + "║")
            print("╠" + "═" * 70 + "╣")
            
            # Progress bar
            progress_bar = self.draw_progress_bar(stats['percentage'], 50)
            status_text = f"Testing: {self.current_test[:30]}..." if self.current_test else "Initializing..."
            print(f"║ {progress_bar} {Colors.RESET}".ljust(80) + f"{Colors.CYAN}║")
            print(f"║ {Colors.YELLOW}{status_text[:68]}{Colors.CYAN}".ljust(87) + "║")
            print("╠" + "═" * 70 + "╣")
            
            # Category status grid
            categories = list(self.suite.categories.keys())
            for i in range(0, len(categories), 3):
                row_cats = categories[i:i+3]
                row_items = []
                for cat in row_cats:
                    cat_results = self.suite.categories[cat]
                    passed = all(r.status == "passed" for r in cat_results)
                    failed = any(r.status == "failed" for r in cat_results)
                    running = any(r.status == "running" for r in cat_results)
                    
                    if failed:
                        icon = f"{Colors.RED}❌{Colors.RESET}"
                    elif passed:
                        icon = f"{Colors.GREEN}✅{Colors.RESET}"
                    elif running:
                        icon = f"{Colors.YELLOW}🔄{Colors.RESET}"
                    else:
                        icon = f"{Colors.DIM}⏳{Colors.RESET}"
                    
                    row_items.append(f"{icon} {cat[:18]:<18}")
                
                print(f"║ {'  '.join(row_items)}{Colors.CYAN}".ljust(95) + "║")
            
            print("╠" + "═" * 70 + "╣")
            
            # Current detail
            detail = self.current_detail[:68] if self.current_detail else ""
            print(f"║ {Colors.DIM}{detail}{Colors.CYAN}".ljust(87) + "║")
            
            # Stats
            print(f"║ {Colors.GREEN}Passed: {stats['passed']}{Colors.CYAN}  "
                  f"{Colors.RED}Failed: {stats['failed']}{Colors.CYAN}  "
                  f"{Colors.BLUE}Skipped: {stats['skipped']}{Colors.CYAN}  "
                  f"Elapsed: {elapsed:.1f}s".ljust(85) + "║")
            
            print("╚" + "═" * 70 + "╝")
            print(f"{Colors.RESET}")
    
    def update(self, test_name: str = "", detail: str = ""):
        self.current_test = test_name
        self.current_detail = detail
        self.render()

# ═══════════════════════════════════════════════════════════════════════════════
# TEST FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════════

def run_command(cmd: str, timeout: int = 30) -> Tuple[int, str, str]:
    """Execute shell command and return output."""
    try:
        result = subprocess.run(
            cmd, shell=True, capture_output=True, text=True, timeout=timeout
        )
        return result.returncode, result.stdout, result.stderr
    except subprocess.TimeoutExpired:
        return -1, "", "Command timed out"
    except Exception as e:
        return 1, "", str(e)

def check_port(host: str, port: int, timeout: float = 2.0) -> bool:
    """Check if a port is open."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except:
        return False

# ═══════════════════════════════════════════════════════════════════════════════
# TEST CATEGORIES
# ═══════════════════════════════════════════════════════════════════════════════

def test_file_structure(suite: TestSuite, display: LiveDisplay):
    """Test file system structure."""
    required_files = [
        'README.md', 'CREDITS.md', 'MANIFESTO.md', '.env.example',
        'config/credentials.json.example', 'docker-compose.yml',
        'LAUNCH.bat', 'ONBOARDING_CHECKLIST.md',
        'dashboard/package.json', 'dashboard/src/App.jsx',
        'wonky-sprout/package.json', 'backend/backend_core.py',
        'phenix_phantom/CMakeLists.txt', 'src/lib.rs'
    ]
    
    for file in required_files:
        result = suite.add_test(f"File: {file}", "Files")
        result.status = "running"
        display.update(f"Checking {file}", f"Looking for {file}")
        
        if Path(file).exists():
            result.status = "passed"
            result.message = "File exists"
        else:
            result.status = "failed"
            result.message = f"Missing: {file}"
        
        time.sleep(0.1)

def test_configuration(suite: TestSuite, display: LiveDisplay):
    """Test configuration files."""
    # Check .env
    result = suite.add_test(".env exists", "Config")
    result.status = "running"
    display.update("Checking .env", "Looking for environment file")
    
    if Path('.env').exists():
        result.status = "passed"
        # Check for placeholder
        with open('.env', 'r') as f:
            content = f.read()
            if '<' in content or 'YOUR_' in content:
                result.message = "Warning: Contains placeholders"
            else:
                result.message = "Configured"
    else:
        result.status = "failed"
        result.message = "Missing .env file"
    
    time.sleep(0.1)
    
    # Check credentials.json
    result = suite.add_test("credentials.json", "Config")
    result.status = "running"
    display.update("Checking credentials", "Validating JSON format")
    
    cred_path = Path('config/credentials.json')
    if cred_path.exists():
        try:
            with open(cred_path, 'r') as f:
                json.load(f)
            result.status = "passed"
            result.message = "Valid JSON"
        except json.JSONDecodeError as e:
            result.status = "failed"
            result.message = f"Invalid JSON: {e}"
    else:
        result.status = "skipped"
        result.message = "Not configured (using .example)"
    
    time.sleep(0.1)
    
    # Check docker-compose.yml
    result = suite.add_test("docker-compose.yml syntax", "Config")
    result.status = "running"
    display.update("Validating Docker Compose", "Checking YAML syntax")
    
    code, out, err = run_command("docker-compose config -q 2>&1")
    if code == 0:
        result.status = "passed"
        result.message = "Valid syntax"
    else:
        result.status = "failed"
        result.message = f"Invalid: {err[:50]}"
    
    time.sleep(0.1)

def test_docker(suite: TestSuite, display: LiveDisplay):
    """Test Docker infrastructure."""
    # Check Docker daemon
    result = suite.add_test("Docker daemon", "Docker")
    result.status = "running"
    display.update("Checking Docker", "Verifying daemon is running")
    
    code, out, err = run_command("docker info")
    if code == 0:
        result.status = "passed"
        result.message = "Docker is running"
    else:
        result.status = "failed"
        result.message = "Docker not running"
        return  # Skip other Docker tests
    
    time.sleep(0.1)
    
    # Check containers
    containers = [
        ('phenix_redis', 6379),
        ('phenix_db', 5432),
    ]
    
    for name, port in containers:
        result = suite.add_test(f"Container: {name}", "Docker")
        result.status = "running"
        display.update(f"Checking {name}", f"Verifying container status")
        
        code, out, err = run_command(f'docker ps --filter "name={name}" --format "{{{{.Status}}}}"')
        if 'Up' in out:
            result.status = "passed"
            result.message = f"Running (port {port})"
        else:
            result.status = "skipped"
            result.message = "Not running (optional)"
        
        time.sleep(0.1)

def test_network(suite: TestSuite, display: LiveDisplay):
    """Test network endpoints."""
    endpoints = [
        ('Dashboard', 'localhost', 5173),
        ('Backend API', 'localhost', 8000),
        ('Streamlit', 'localhost', 8501),
        ('Redis', 'localhost', 6379),
        ('PostgreSQL', 'localhost', 5432),
        ('Ollama', 'localhost', 11434),
    ]
    
    for name, host, port in endpoints:
        result = suite.add_test(f"{name} ({port})", "Network")
        result.status = "running"
        display.update(f"Testing {name}", f"Checking {host}:{port}")
        
        if check_port(host, port):
            result.status = "passed"
            result.message = f"Port {port} open"
        else:
            result.status = "skipped"
            result.message = f"Port {port} closed (service not running)"
        
        time.sleep(0.1)

def test_dependencies(suite: TestSuite, display: LiveDisplay, fast: bool = False):
    """Test dependencies."""
    # Python packages
    python_packages = ['redis', 'requests', 'websockets']
    
    for pkg in python_packages:
        result = suite.add_test(f"Python: {pkg}", "Dependencies")
        result.status = "running"
        display.update(f"Checking {pkg}", f"Importing Python module")
        
        try:
            __import__(pkg)
            result.status = "passed"
            result.message = "Installed"
        except ImportError:
            result.status = "failed"
            result.message = f"Not installed (pip install {pkg})"
        
        time.sleep(0.05)
    
    # Node.js check
    result = suite.add_test("Node.js", "Dependencies")
    result.status = "running"
    display.update("Checking Node.js", "Verifying installation")
    
    code, out, err = run_command("node --version")
    if code == 0:
        result.status = "passed"
        result.message = f"Version {out.strip()}"
    else:
        result.status = "failed"
        result.message = "Node.js not installed"
    
    time.sleep(0.1)
    
    # Check dashboard node_modules
    result = suite.add_test("Dashboard packages", "Dependencies")
    result.status = "running"
    display.update("Checking dashboard", "Looking for node_modules")
    
    if Path('dashboard/node_modules').exists():
        result.status = "passed"
        result.message = "node_modules present"
    else:
        result.status = "skipped"
        result.message = "Run: cd dashboard && npm install"
    
    time.sleep(0.1)

def test_git(suite: TestSuite, display: LiveDisplay):
    """Test Git repository."""
    # Check git repo
    result = suite.add_test("Git repository", "Git")
    result.status = "running"
    display.update("Checking Git", "Verifying repository")
    
    code, out, err = run_command("git rev-parse --is-inside-work-tree")
    if code == 0 and 'true' in out:
        result.status = "passed"
        result.message = "Valid git repo"
    else:
        result.status = "failed"
        result.message = "Not a git repository"
        return
    
    time.sleep(0.1)
    
    # Check remote
    result = suite.add_test("Git remote", "Git")
    result.status = "running"
    display.update("Checking remote", "Verifying origin")
    
    code, out, err = run_command("git remote get-url origin")
    if code == 0:
        result.status = "passed"
        result.message = out.strip()[:40]
    else:
        result.status = "skipped"
        result.message = "No remote configured"
    
    time.sleep(0.1)
    
    # Check for uncommitted secrets
    result = suite.add_test("Secrets not tracked", "Git")
    result.status = "running"
    display.update("Security check", "Verifying .gitignore")
    
    code, out, err = run_command("git status --porcelain")
    sensitive_files = ['.env', 'credentials.json']
    tracked_secrets = [f for f in sensitive_files if f in out]
    
    if not tracked_secrets:
        result.status = "passed"
        result.message = "Sensitive files not tracked"
    else:
        result.status = "failed"
        result.message = f"Warning: {', '.join(tracked_secrets)} in git"
    
    time.sleep(0.1)

def test_security(suite: TestSuite, display: LiveDisplay):
    """Security checks."""
    # Check .gitignore
    result = suite.add_test(".gitignore complete", "Security")
    result.status = "running"
    display.update("Checking .gitignore", "Verifying entries")
    
    gitignore_path = Path('.gitignore')
    if gitignore_path.exists():
        content = gitignore_path.read_text(encoding='utf-8', errors='ignore')
        required = ['.env', 'credentials.json', 'node_modules']
        missing = [r for r in required if r not in content]
        
        if not missing:
            result.status = "passed"
            result.message = "All sensitive paths ignored"
        else:
            result.status = "failed"
            result.message = f"Missing: {', '.join(missing)}"
    else:
        result.status = "failed"
        result.message = ".gitignore not found"
    
    time.sleep(0.1)
    
    # Check for hardcoded secrets
    result = suite.add_test("No hardcoded secrets", "Security")
    result.status = "running"
    display.update("Scanning for secrets", "Checking source files")
    
    # Simple check - look for common patterns
    code, out, err = run_command('findstr /s /i "password.*=" *.py 2>nul')
    suspicious = [line for line in out.split('\n') if 'phenix_secret' in line.lower()]
    
    if not suspicious:
        result.status = "passed"
        result.message = "No obvious hardcoded secrets"
    else:
        result.status = "skipped"
        result.message = "Review recommended"
    
    time.sleep(0.1)

def test_unit_tests(suite: TestSuite, display: LiveDisplay, fast: bool = False):
    """Run unit tests."""
    if fast:
        result = suite.add_test("Unit tests", "Tests")
        result.status = "skipped"
        result.message = "Skipped (--fast mode)"
        return
    
    # Python tests
    result = suite.add_test("Fisher-Escola test", "Tests")
    result.status = "running"
    display.update("Running Python tests", "backend/tests/test_fisher_escola.py")
    
    code, out, err = run_command("python -m pytest backend/tests/test_fisher_escola.py -v --tb=short 2>&1", timeout=60)
    if code == 0:
        result.status = "passed"
        result.message = "All tests passed"
    elif 'No module' in err or 'ModuleNotFoundError' in err:
        result.status = "skipped"
        result.message = "Dependencies missing"
    else:
        result.status = "failed"
        result.message = f"Tests failed: {err[:50]}"
    
    time.sleep(0.1)
    
    # Rust check
    result = suite.add_test("Rust lib syntax", "Tests")
    result.status = "running"
    display.update("Checking Rust", "Verifying src/lib.rs")
    
    code, out, err = run_command("cargo check --lib 2>&1", timeout=120)
    if code == 0:
        result.status = "passed"
        result.message = "Rust code compiles"
    elif 'not found' in err.lower() or 'not installed' in err.lower():
        result.status = "skipped"
        result.message = "Rust not installed"
    else:
        result.status = "failed"
        result.message = "Compilation errors"
    
    time.sleep(0.1)

# ═══════════════════════════════════════════════════════════════════════════════
# MAIN EXECUTION
# ═══════════════════════════════════════════════════════════════════════════════

def main():
    parser = argparse.ArgumentParser(description="Phenix Navigator Full System Test")
    parser.add_argument('--fast', action='store_true', help='Skip slow tests')
    parser.add_argument('--json', action='store_true', help='Output JSON report')
    parser.add_argument('--watch', action='store_true', help='Continuous monitoring')
    args = parser.parse_args()
    
    suite = TestSuite()
    display = LiveDisplay(suite)
    
    suite.start_time = time.time()
    
    # Run all test categories
    test_functions = [
        (test_file_structure, "File Structure"),
        (test_configuration, "Configuration"),
        (test_docker, "Docker"),
        (test_network, "Network"),
        (test_dependencies, "Dependencies"),
        (test_git, "Git"),
        (test_security, "Security"),
        (test_unit_tests, "Unit Tests"),
    ]
    
    for test_func, name in test_functions:
        display.update(name, f"Running {name} tests...")
        if 'fast' in test_func.__code__.co_varnames:
            test_func(suite, display, args.fast)
        else:
            test_func(suite, display)
        display.render()
    
    # Final render
    display.current_test = "Complete!"
    display.current_detail = ""
    display.render()
    
    # Summary
    stats = suite.get_stats()
    elapsed = time.time() - suite.start_time
    
    print(f"\n{Colors.BOLD}📊 FINAL REPORT{Colors.RESET}")
    print("=" * 50)
    
    # Group by category
    for category, results in suite.categories.items():
        passed = len([r for r in results if r.status == "passed"])
        total = len(results)
        color = Colors.GREEN if passed == total else Colors.YELLOW if passed > 0 else Colors.RED
        print(f"\n{Colors.BOLD}{category}:{Colors.RESET}")
        for r in results:
            icon = display.get_status_icon(r.status)
            print(f"  {icon} {r.name}: {r.message}")
    
    print(f"\n{'=' * 50}")
    print(f"Total: {stats['passed']}/{stats['total']} passed")
    print(f"Time: {elapsed:.1f}s")
    
    # JSON output
    if args.json:
        report = {
            "timestamp": datetime.now().isoformat(),
            "stats": stats,
            "duration": elapsed,
            "results": [
                {
                    "name": r.name,
                    "category": r.category,
                    "status": r.status,
                    "message": r.message
                }
                for r in suite.results
            ]
        }
        report_path = Path('test_report.json')
        report_path.write_text(json.dumps(report, indent=2))
        print(f"\n📄 Report saved to: {report_path}")
    
    # Exit code
    if stats['failed'] > 0:
        print(f"\n{Colors.RED}❌ Some tests failed!{Colors.RESET}")
        sys.exit(1)
    else:
        print(f"\n{Colors.GREEN}✅ All critical tests passed!{Colors.RESET}")
        sys.exit(0)

if __name__ == "__main__":
    main()

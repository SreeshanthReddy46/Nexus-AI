import unittest
import sys
import os

# Add src/agents to path if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

from agent_engine import SearchAgent

class TestRAG(unittest.TestCase):
    def test_similarity_search(self):
        agent = SearchAgent()
        sources = list(set([c["source"] for c in agent.chunks]))
        print(f"DEBUG: Indexed sources ({len(sources)}): {sources[:15]}")
        print(f"DEBUG: Initialized SearchAgent with {len(agent.chunks)} chunks.")
        results = agent.search("payment service idempotency key")
        print("DEBUG: Search results for 'payment service idempotency key':")
        for r in results:
            print(f"  - Source: {r['source']}, Score: {r['score']}, Text: {r['text'][:60]}")
        self.assertTrue(len(results) > 0)
        self.assertTrue(any("checkout-api-v2.md" in r["source"] for r in results))

    def test_codebase_crawling(self):
        agent = SearchAgent()
        results = agent.search("jsonParseSafe")
        print("DEBUG: Search results for 'jsonParseSafe':")
        for r in results:
            print(f"  - Source: {r['source']}, Score: {r['score']}, Text: {r['text'][:60]}")
        self.assertTrue(len(results) > 0)
        self.assertTrue(any("route.ts" in r["source"] or "agent_engine.py" in r["source"] for r in results))

if __name__ == "__main__":
    unittest.main()

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

    def test_agent_pipeline(self):
        from agent_engine import process_query
        response = process_query({
            "query": "find contradictions",
            "plan": "pro",
            "role": "Admin",
            "workspace": "NEXUS-HQ"
        })
        self.assertIn("Conflict Analysis", response["text"])
        self.assertEqual(len(response["trace"]), 5)
        # Check that Explore, Search, Reviewer, Cerifier, and Response agents are in trace
        agents = [t["agent"] for t in response["trace"]]
        self.assertIn("Explore Agent", agents)
        self.assertIn("Search Agent", agents)
        self.assertIn("Reviewer Agent", agents)
        self.assertIn("Cerifier Agent", agents)
        self.assertIn("Response Agent", agents)

if __name__ == "__main__":
    unittest.main()

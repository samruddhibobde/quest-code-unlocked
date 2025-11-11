export interface StorylineQuest {
	id: number;
	title: string;
	story: string;
	challenge: string;
	visual: string; // now stores a key instead of image path
	completed: boolean;
	unlocked: boolean;
  }
  
  export const storylineQuests: StorylineQuest[] = [
	{
	  id: 1,
	  title: "The Collapsing Bridge",
	  story:
		"A traveler needs to cross a collapsing bridge. The bridge has gaps that appear randomly. Write an algorithm to help him cross in the shortest possible time before the bridge breaks completely.",
	  challenge:
		"Implement a shortest path algorithm (Dijkstra's or BFS) to find the fastest route across the bridge.",
	  visual: "bridge", // ✅ use this key name, not an image path
	  completed: false,
	  unlocked: true,
	},
	{
	  id: 2,
	  title: "The Locked Gate",
	  story:
		"The ancient gate is protected by a cipher. You must decrypt the string to unlock the gate and proceed to the next realm.",
	  challenge:
		"Write a function to decrypt a string using a given key. Handle edge cases like empty strings and invalid keys.",
	  visual: "🚪",
	  completed: false,
	  unlocked: false,
	},
	{
	  id: 3,
	  title: "The River of Loops",
	  story:
		"The river flows with data streams. You must optimize your loop to process the data efficiently without causing a flood.",
	  challenge:
		"Optimize a nested loop that processes a 2D array. Reduce time complexity from O(n²) to O(n log n) or better.",
	  visual: "🌊",
	  completed: false,
	  unlocked: false,
	},
	{
	  id: 4,
	  title: "The Tower of Arrays",
	  story:
		"The tower is built with arrays that need to be rearranged. Sort and reorganize the elements to stabilize the structure.",
	  challenge:
		"Rearrange array elements efficiently using in-place sorting algorithms. Implement quicksort or mergesort.",
	  visual: "🗼",
	  completed: false,
	  unlocked: false,
	},
	{
	  id: 5,
	  title: "The Final Firewall",
	  story:
		"The last barrier is a firewall with bugs. Debug and secure the system to break through and complete your quest.",
	  challenge:
		"Debug a given code snippet with security vulnerabilities. Fix memory leaks, buffer overflows, and input validation issues.",
	  visual: "🔥",
	  completed: false,
	  unlocked: false,
	},
  ];
  
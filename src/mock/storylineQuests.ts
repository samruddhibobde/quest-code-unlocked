export interface StorylineQuest {
	id: number;
	title: string;
	story: string;
	challenge: string;
	visual: string; // now stores a key instead of image path
	completed: boolean;
	unlocked: boolean;
  }

export interface StoryChapter {
  id: number;
  questId: number;
  chapterNumber: number;
  title: string;
  narrative: string;        // The story text shown before problem
  characterInDanger: string; // e.g. "Raj is about to fall!"
  missionBrief: string;     // e.g. "Help Raj by solving this problem"
  problem: {
    title: string;
    description: string;
    difficulty: "Easy" | "Medium" | "Hard";
    xp: number;
    hint: string;
    starterCode: {
      python: string;
      javascript: string;
      cpp: string;
    };
    testCases: { input: string; expectedOutput: string }[];
  };
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
	  visual: "",
	  completed: false,
	  unlocked: false,
	},
  ];
  
export const storyChapters: StoryChapter[] = [
  {
    id: 1, questId: 1, chapterNumber: 1,
    title: "Chapter 1: The First Gap",
    narrative: "Raj runs toward the ancient bridge. Beneath him, the wooden planks creak and splinter. A gap appears - 3 planks missing. He needs to know the shortest jump possible to cross safely.",
    characterInDanger: "Raj is about to fall into the gap!",
    missionBrief: "Find the minimum number of jumps Raj needs to cross the bridge gaps.",
    problem: {
      title: "Minimum Jumps",
      description: "Given an array where each element represents the maximum jump length from that position, find the minimum number of jumps to reach the last index.\n\nExample: [2,3,1,1,4]  2 jumps",
      difficulty: "Easy",
      xp: 75,
      hint: "Use a greedy approach. Track the current reach and the farthest you can reach at each step.",
      starterCode: {
        python: "def min_jumps(nums):\n    jumps = 0\n    current_end = 0\n    farthest = 0\n    for i in range(len(nums) - 1):\n        farthest = max(farthest, i + nums[i])\n        if i == current_end:\n            jumps += 1\n            current_end = farthest\n    return jumps\n\nprint(min_jumps([2,3,1,1,4]))  # Expected: 2",
        javascript: "function minJumps(nums) {\n    let jumps = 0, currentEnd = 0, farthest = 0;\n    for (let i = 0; i < nums.length - 1; i++) {\n        farthest = Math.max(farthest, i + nums[i]);\n        if (i === currentEnd) { jumps++; currentEnd = farthest; }\n    }\n    return jumps;\n}\nconsole.log(minJumps([2,3,1,1,4])); // Expected: 2",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\nint minJumps(vector<int>& nums) {\n    int jumps=0, currentEnd=0, farthest=0;\n    for(int i=0;i<nums.size()-1;i++){\n        farthest=max(farthest,i+nums[i]);\n        if(i==currentEnd){jumps++;currentEnd=farthest;}\n    }\n    return jumps;\n}\nint main(){vector<int> n={2,3,1,1,4};cout<<minJumps(n)<<endl;return 0;}"
      },
      testCases: [
        { input: "[2,3,1,1,4]", expectedOutput: "2" },
        { input: "[2,3,0,1,4]", expectedOutput: "2" }
      ]
    }
  },
  {
    id: 2, questId: 1, chapterNumber: 2,
    title: "Chapter 2: The Crumbling Path",
    narrative: "Raj made it past the first gap! But now half the bridge has collapsed. He must find the path with the maximum sum of stable planks to survive.",
    characterInDanger: "The bridge is collapsing under Raj's feet!",
    missionBrief: "Find the path with the maximum sum so Raj steps only on the strongest planks.",
    problem: {
      title: "Maximum Subarray",
      description: "Given an array of integers representing plank strengths (negative = broken), find the contiguous subarray with the largest sum.\n\nExample: [-2,1,-3,4,-1,2,1,-5,4]  6",
      difficulty: "Easy",
      xp: 75,
      hint: "Use Kadane's algorithm. Keep track of current sum and max sum seen so far.",
      starterCode: {
        python: "def max_subarray(nums):\n    max_sum = nums[0]\n    current_sum = nums[0]\n    for num in nums[1:]:\n        current_sum = max(num, current_sum + num)\n        max_sum = max(max_sum, current_sum)\n    return max_sum\n\nprint(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6",
        javascript: "function maxSubarray(nums) {\n    let maxSum = nums[0], currentSum = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        currentSum = Math.max(nums[i], currentSum + nums[i]);\n        maxSum = Math.max(maxSum, currentSum);\n    }\n    return maxSum;\n}\nconsole.log(maxSubarray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxSubarray(vector<int>& nums){\n    int maxSum=nums[0],currentSum=nums[0];\n    for(int i=1;i<nums.size();i++){\n        currentSum=max(nums[i],currentSum+nums[i]);\n        maxSum=max(maxSum,currentSum);\n    }\n    return maxSum;\n}\nint main(){vector<int> n={-2,1,-3,4,-1,2,1,-5,4};cout<<maxSubarray(n)<<endl;return 0;}"
      },
      testCases: [
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", expectedOutput: "6" },
        { input: "[1]", expectedOutput: "1" }
      ]
    }
  },
  {
    id: 3, questId: 1, chapterNumber: 3,
    title: "Chapter 3: Across the Abyss",
    narrative: "The final stretch! Raj can see the other side. The last section is a binary maze - planks marked 0 (broken) or 1 (safe). Find the longest safe streak!",
    characterInDanger: "Raj is one step away from safety!",
    missionBrief: "Find the longest streak of safe planks Raj can run across.",
    problem: {
      title: "Max Consecutive Ones",
      description: "Given a binary array, find the maximum number of consecutive 1s. Each 1 is a safe plank, each 0 is broken.\n\nExample: [1,1,0,1,1,1]  3",
      difficulty: "Easy",
      xp: 50,
      hint: "Use a counter. Reset to 0 when you see a 0, update max when you see a 1.",
      starterCode: {
        python: "def max_consecutive_ones(nums):\n    max_count = 0\n    current_count = 0\n    for num in nums:\n        if num == 1:\n            current_count += 1\n            max_count = max(max_count, current_count)\n        else:\n            current_count = 0\n    return max_count\n\nprint(max_consecutive_ones([1,1,0,1,1,1]))  # Expected: 3",
        javascript: "function maxConsecutiveOnes(nums) {\n    let maxCount = 0, currentCount = 0;\n    for (const num of nums) {\n        if (num === 1) { currentCount++; maxCount = Math.max(maxCount, currentCount); }\n        else { currentCount = 0; }\n    }\n    return maxCount;\n}\nconsole.log(maxConsecutiveOnes([1,1,0,1,1,1])); // Expected: 3",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxConsecutiveOnes(vector<int>& nums){\n    int maxCount=0,currentCount=0;\n    for(int num:nums){\n        if(num==1){currentCount++;maxCount=max(maxCount,currentCount);}\n        else{currentCount=0;}\n    }\n    return maxCount;\n}\nint main(){vector<int> n={1,1,0,1,1,1};cout<<maxConsecutiveOnes(n)<<endl;return 0;}"
      },
      testCases: [
        { input: "[1,1,0,1,1,1]", expectedOutput: "3" },
        { input: "[1,0,1,1,0,1]", expectedOutput: "2" }
      ]
    }
  },
  {
    id: 4, questId: 2, chapterNumber: 1,
    title: "Chapter 1: The Ancient Cipher",
    narrative: "Priya stands before the ancient gate. The gate speaks: 'Reverse my name and I shall open.' She must reverse the cipher string to unlock the first bolt.",
    characterInDanger: "Priya is trapped - the gate won't budge!",
    missionBrief: "Reverse the cipher string to unlock the first bolt of the gate.",
    problem: {
      title: "Reverse a String",
      description: "Given a string (the cipher), return it reversed.\n\nExample: 'guardian'  'naidraug'",
      difficulty: "Easy",
      xp: 50,
      hint: "In Python use slicing [::-1]. In JS use split/reverse/join.",
      starterCode: {
        python: "def reverse_cipher(s):\n    return s[::-1]\n\nprint(reverse_cipher('guardian'))  # Expected: naidraug",
        javascript: "function reverseCipher(s) {\n    return s.split('').reverse().join('');\n}\nconsole.log(reverseCipher('guardian')); // naidraug",
        cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\nstring reverseCipher(string s){reverse(s.begin(),s.end());return s;}\nint main(){cout<<reverseCipher(\"guardian\")<<endl;return 0;}"
      },
      testCases: [
        { input: "'guardian'", expectedOutput: "naidraug" },
        { input: "'hello'", expectedOutput: "olleh" }
      ]
    }
  },
  {
    id: 5, questId: 2, chapterNumber: 2,
    title: "Chapter 2: The Bracket Lock",
    narrative: "The first bolt opens! A second lock appears - a mechanical bracket puzzle. The gate opens only if all brackets are perfectly balanced.",
    characterInDanger: "The bracket mechanism is jammed - Priya can't get through!",
    missionBrief: "Check if the bracket sequence is valid to unlock the second bolt.",
    problem: {
      title: "Valid Parentheses",
      description: "Given a string of brackets, determine if it is valid. Every opening bracket must be closed in the correct order.\n\nExample: '()[]{}'  true, '(]'  false",
      difficulty: "Easy",
      xp: 75,
      hint: "Use a stack. Push opening brackets, pop and match when you see a closing bracket.",
      starterCode: {
        python: "def is_valid(s):\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in mapping:\n            top = stack.pop() if stack else '#'\n            if mapping[char] != top:\n                return False\n        else:\n            stack.append(char)\n    return not stack\n\nprint(is_valid('()[]{}'))  # True\nprint(is_valid('(]'))      # False",
        javascript: "function isValid(s) {\n    const stack = [];\n    const mapping = {')':'(', '}':'{', ']':'['};\n    for (const char of s) {\n        if (mapping[char]) {\n            if (stack.pop() !== mapping[char]) return false;\n        } else stack.push(char);\n    }\n    return stack.length === 0;\n}\nconsole.log(isValid('()[]{}')); // true",
        cpp: "#include <iostream>\n#include <stack>\n#include <string>\nusing namespace std;\nbool isValid(string s){\n    stack<char> st;\n    for(char c:s){\n        if(c=='('||c=='{'||c=='[') st.push(c);\n        else{\n            if(st.empty()) return false;\n            char top=st.top();st.pop();\n            if((c==')'&&top!='(')||(c=='}'&&top!='{')||(c==']'&&top!='[')) return false;\n        }\n    }\n    return st.empty();\n}\nint main(){cout<<isValid(\"()[]{}\")<<endl;return 0;}"
      },
      testCases: [
        { input: "'()[]{}'", expectedOutput: "true" },
        { input: "'(]'", expectedOutput: "false" }
      ]
    }
  },
  {
    id: 6, questId: 3, chapterNumber: 1,
    title: "Chapter 1: The Data Flood",
    narrative: "Arjun stands at the River of Loops. The river carries unsorted data streams. Unless Arjun sorts them, the flood will overwhelm the village downstream.",
    characterInDanger: "The village will flood unless Arjun sorts the data!",
    missionBrief: "Sort the river data stream to control the flood.",
    problem: {
      title: "Sort an Array",
      description: "Sort the array of river data from smallest to largest using merge sort.\n\nExample: [38,27,43,3,9,82,10]  [3,9,10,27,38,43,82]",
      difficulty: "Medium",
      xp: 100,
      hint: "Divide the array in half recursively, then merge the sorted halves back together.",
      starterCode: {
        python: "def merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\nprint(merge_sort([38,27,43,3,9,82,10]))",
        javascript: "function mergeSort(arr) {\n    if (arr.length <= 1) return arr;\n    const mid = Math.floor(arr.length / 2);\n    return merge(mergeSort(arr.slice(0,mid)), mergeSort(arr.slice(mid)));\n}\nfunction merge(left, right) {\n    const result = [];\n    let i=0, j=0;\n    while(i<left.length && j<right.length)\n        result.push(left[i]<=right[j] ? left[i++] : right[j++]);\n    return [...result,...left.slice(i),...right.slice(j)];\n}\nconsole.log(mergeSort([38,27,43,3,9,82,10]));",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\nvector<int> merge(vector<int> l,vector<int> r){\n    vector<int> res;int i=0,j=0;\n    while(i<l.size()&&j<r.size()) res.push_back(l[i]<=r[j]?l[i++]:r[j++]);\n    while(i<l.size()) res.push_back(l[i++]);\n    while(j<r.size()) res.push_back(r[j++]);\n    return res;\n}\nvector<int> mergeSort(vector<int> arr){\n    if(arr.size()<=1) return arr;\n    int mid=arr.size()/2;\n    return merge(mergeSort(vector<int>(arr.begin(),arr.begin()+mid)),mergeSort(vector<int>(arr.begin()+mid,arr.end())));\n}\nint main(){vector<int> a={38,27,43,3,9,82,10};auto s=mergeSort(a);for(int x:s)cout<<x<<\" \";return 0;}"
      },
      testCases: [
        { input: "[38,27,43,3,9,82,10]", expectedOutput: "[3,9,10,27,38,43,82]" },
        { input: "[5,2,4,6,1,3]", expectedOutput: "[1,2,3,4,5,6]" }
      ]
    }
  },
  {
    id: 7, questId: 4, chapterNumber: 1,
    title: "Chapter 1: Stabilize the Tower",
    narrative: "The Tower of Arrays is crumbling! Maya must find the two floors that form the largest container to hold the structure together and save the tower.",
    characterInDanger: "The tower is collapsing - Maya must act fast!",
    missionBrief: "Find the two floors that can hold the most water to stabilize the tower.",
    problem: {
      title: "Container With Most Water",
      description: "Given an array of floor heights, find two floors that together hold the most water.\n\nExample: [1,8,6,2,5,4,8,3,7]  49",
      difficulty: "Medium",
      xp: 100,
      hint: "Use two pointers from both ends. Move the pointer with the smaller height inward.",
      starterCode: {
        python: "def max_water(height):\n    left, right = 0, len(height) - 1\n    max_w = 0\n    while left < right:\n        water = min(height[left], height[right]) * (right - left)\n        max_w = max(max_w, water)\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return max_w\n\nprint(max_water([1,8,6,2,5,4,8,3,7]))  # Expected: 49",
        javascript: "function maxWater(height) {\n    let left=0, right=height.length-1, maxW=0;\n    while(left<right){\n        maxW=Math.max(maxW,Math.min(height[left],height[right])*(right-left));\n        if(height[left]<height[right]) left++;\n        else right--;\n    }\n    return maxW;\n}\nconsole.log(maxWater([1,8,6,2,5,4,8,3,7])); // 49",
        cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint maxWater(vector<int>& h){\n    int l=0,r=h.size()-1,maxW=0;\n    while(l<r){maxW=max(maxW,min(h[l],h[r])*(r-l));if(h[l]<h[r])l++;else r--;}\n    return maxW;\n}\nint main(){vector<int> h={1,8,6,2,5,4,8,3,7};cout<<maxWater(h)<<endl;return 0;}"
      },
      testCases: [
        { input: "[1,8,6,2,5,4,8,3,7]", expectedOutput: "49" },
        { input: "[1,1]", expectedOutput: "1" }
      ]
    }
  },
  {
    id: 8, questId: 5, chapterNumber: 1,
    title: "Chapter 1: Breach the Firewall",
    narrative: "The Final Firewall stands before Zara. It runs on binary - it only opens when she finds the single corrupted bit that appears only once while all others appear twice.",
    characterInDanger: "The firewall will lock forever unless Zara finds the corrupted bit!",
    missionBrief: "Find the single non-duplicate number to disable the firewall.",
    problem: {
      title: "Single Number",
      description: "Every element appears twice except for one. Find that single element.\n\nExample: [4,1,2,1,2]  4",
      difficulty: "Easy",
      xp: 75,
      hint: "Use XOR. A number XOR itself = 0. XOR all elements and the duplicate pairs cancel out.",
      starterCode: {
        python: "def find_single(nums):\n    result = 0\n    for num in nums:\n        result ^= num\n    return result\n\nprint(find_single([4,1,2,1,2]))  # Expected: 4\nprint(find_single([2,2,1]))      # Expected: 1",
        javascript: "function findSingle(nums) {\n    let result = 0;\n    for (const num of nums) result ^= num;\n    return result;\n}\nconsole.log(findSingle([4,1,2,1,2])); // 4",
        cpp: "#include <iostream>\n#include <vector>\nusing namespace std;\nint findSingle(vector<int>& nums){int r=0;for(int n:nums)r^=n;return r;}\nint main(){vector<int> n={4,1,2,1,2};cout<<findSingle(n)<<endl;return 0;}"
      },
      testCases: [
        { input: "[4,1,2,1,2]", expectedOutput: "4" },
        { input: "[2,2,1]", expectedOutput: "1" }
      ]
    }
  }
];
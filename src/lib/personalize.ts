// Personalization utility for Koorma content
// Replaces placeholders like {child}, {friend1}, etc. with actual names

export interface PersonalizationProfile {
  childName: string;
  childNickname?: string;
  friends: string[];
}

// Default fallback names when friends are not provided
const DEFAULT_FRIENDS = ["Chintu", "Ammamma", "Bunny", "Chiku"];

/**
 * Personalize content by replacing name placeholders with actual names
 *
 * Supported placeholders:
 * - {child} → nickname or name (displayName)
 * - {friend1} → first friend name
 * - {friend2} → second friend name
 * - {friend3} → third friend name
 * - {friend4} → fourth friend name
 * - {randomFriend} → randomly selected friend name
 *
 * @example
 * personalize("{child} and {friend1} went to school.", { childName: "Aarav", childNickname: "Aaru", friends: ["Riya"] })
 * // Returns: "Aaru and Riya went to school."
 */
export function personalize(template: string, profile: PersonalizationProfile): string {
  const displayName = profile.childNickname?.trim() || profile.childName?.trim() || "you";
  const friends = profile.friends || [];

  // Get friend with fallback to default
  const getFriend = (index: number): string => {
    const friend = friends[index]?.trim();
    if (friend) return friend;
    return DEFAULT_FRIENDS[index] || DEFAULT_FRIENDS[0];
  };

  // Get random friend
  const getRandomFriend = (): string => {
    if (friends.length > 0) {
      const validFriends = friends.filter(f => f?.trim());
      if (validFriends.length > 0) {
        return validFriends[Math.floor(Math.random() * validFriends.length)];
      }
    }
    return DEFAULT_FRIENDS[Math.floor(Math.random() * DEFAULT_FRIENDS.length)];
  };

  return template
    .replace(/\{child\}/g, displayName)
    .replace(/\{friend1\}/g, getFriend(0))
    .replace(/\{friend2\}/g, getFriend(1))
    .replace(/\{friend3\}/g, getFriend(2))
    .replace(/\{friend4\}/g, getFriend(3))
    .replace(/\{randomFriend\}/g, getRandomFriend());
}

/**
 * Create a personalize function bound to a specific profile
 * Useful for components that need to personalize multiple strings
 *
 * @example
 * const p = createPersonalizer(profile);
 * const story = p("{child} and {friend1} went to school.");
 * const quiz = p("{friend2} asked a question.");
 */
export function createPersonalizer(profile: PersonalizationProfile) {
  return (template: string) => personalize(template, profile);
}

/**
 * Check if a string contains any personalization placeholders
 */
export function hasPlaceholders(text: string): boolean {
  return /\{(child|friend[1-4]|randomFriend)\}/.test(text);
}

/**
 * Get all placeholders used in a template
 */
export function getPlaceholders(template: string): string[] {
  const matches = template.match(/\{(child|friend[1-4]|randomFriend)\}/g);
  return matches ? [...new Set(matches)] : [];
}

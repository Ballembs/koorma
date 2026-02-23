import { useMemo, useCallback } from "react";
import { useProfile } from "@/lib/store";
import { personalize, createPersonalizer, type PersonalizationProfile } from "@/lib/personalize";

/**
 * Hook for personalizing content with child and friend names
 *
 * @example
 * function StoryCard() {
 *   const { p, profile } = usePersonalize();
 *
 *   return (
 *     <div>
 *       <p>{p("{child} and {friend1} went to school.")}</p>
 *       <p>Hello, {profile.displayName}!</p>
 *     </div>
 *   );
 * }
 */
export function usePersonalize() {
  const profile = useProfile();

  // Create a stable personalization profile object
  const personalizationProfile: PersonalizationProfile = useMemo(
    () => ({
      childName: profile.childName,
      childNickname: profile.childNickname,
      friends: profile.friends,
    }),
    [profile.childName, profile.childNickname, profile.friends]
  );

  // Create a stable personalizer function
  const p = useCallback(
    (template: string) => personalize(template, personalizationProfile),
    [personalizationProfile]
  );

  return {
    // The personalize function bound to the current profile
    p,
    // Alternative name for the personalize function
    personalize: p,
    // The full profile for direct access
    profile: {
      ...profile,
      // displayName is already computed in useProfile
    },
    // Raw personalization profile for advanced use
    personalizationProfile,
  };
}

/**
 * Hook that returns just the bound personalizer function
 * Use this when you only need to personalize strings
 *
 * @example
 * const p = usePersonalizer();
 * return <p>{p("{child} found a letter!")}</p>;
 */
export function usePersonalizer() {
  const { p } = usePersonalize();
  return p;
}

export { createPersonalizer, personalize };

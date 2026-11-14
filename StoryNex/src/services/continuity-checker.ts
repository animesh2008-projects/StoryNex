import { Character, StoryMemory, ContinuityWarning } from '../types';

export function runContinuityAudit(
  content: string,
  characters: Character[],
  memories: StoryMemory[]
): ContinuityWarning[] {
  const warnings: ContinuityWarning[] = [];
  const textLower = content.toLowerCase();

  // 1. Character Motivation & Fear Checks
  for (const char of characters) {
    const charNameLower = char.name.toLowerCase();
    const isPresent = textLower.includes(charNameLower) || 
      (charNameLower.split(' ')[0] && textLower.includes(charNameLower.split(' ')[0]));

    if (isPresent) {
      // Check for fear violations
      for (const fear of char.fears) {
        const fearLower = fear.toLowerCase();
        if (fearLower.includes('synthetic') || fearLower.includes('ai') || fearLower.includes('robot')) {
          if (textLower.includes('trusted the ai') || textLower.includes('warmly embraced the synth') || textLower.includes('blind faith in the station core')) {
            warnings.push({
              id: `warn_fear_${char.id}_${Date.now()}`,
              type: 'character_conflict',
              severity: 'high',
              issue: `${char.name} is acting against their fundamental fear: "${fear}".`,
              relatedEntity: char.name,
              suggestedResolution: `Preserve ${char.name}'s skepticism and cautious avoidance of synthetic intelligence. Show hesitation or internal resistance.`
            });
          }
        }
        if (fearLower.includes('cognitive') || fearLower.includes('memory') || fearLower.includes('continuity')) {
          if (textLower.includes('forgot his past without caring') || textLower.includes('dismissed his memory loss')) {
            warnings.push({
              id: `warn_cognitive_${char.id}_${Date.now()}`,
              type: 'character_conflict',
              severity: 'medium',
              issue: `${char.name} dismisses cognitive instability, contradicting established psychological stakes (${fear}).`,
              relatedEntity: char.name,
              suggestedResolution: `Emphasize how ${char.name} compulsively checks physical logs or timestamps to verify reality.`
            });
          }
        }
      }

      // Check for dialogue style inconsistencies
      if (char.dialogueStyle.toLowerCase().includes('measured') || char.dialogueStyle.toLowerCase().includes('cadence')) {
        if (textLower.includes(`${charNameLower} screamed hysterically`) || textLower.includes(`${charNameLower} babied`)) {
          warnings.push({
            id: `warn_style_${char.id}`,
            type: 'character_conflict',
            severity: 'low',
            issue: `Voice inflection mismatch: ${char.name}'s dialogue style is typically "${char.dialogueStyle}".`,
            relatedEntity: char.name,
            suggestedResolution: `Keep ${char.name}'s spoken responses restrained, relying on quiet cadence and calculated phrasing.`
          });
        }
      }
    }
  }

  // 2. Worldbuilding & Historical Fact Consistency
  for (const mem of memories) {
    if (mem.type === 'world_fact') {
      const factLower = mem.content.toLowerCase();
      // Communication latency check
      if (factLower.includes('22 hours') || (factLower.includes('kepler') && factLower.includes('hours'))) {
        if (textLower.includes('instant radio call') || textLower.includes('live video link') || textLower.includes('real-time call')) {
          warnings.push({
            id: `warn_lore_${mem.id}`,
            type: 'worldbuilding_conflict',
            severity: 'high',
            issue: `Violates established communication latency rule: planetary transmission takes 22 hours each way.`,
            relatedEntity: 'Kepler Relay Comms',
            sourceChapterTitle: mem.sourceChapterTitle || 'Established Lore',
            suggestedResolution: `Change direct call to delayed telemetry queue or asynchronous encrypted packet.`
          });
        }
      }
      // Inorganic relay check
      if (factLower.includes('inorganic') || factLower.includes('cedar smoke')) {
        if (textLower.includes('forest right outside') || textLower.includes('woodland trees on sub-level')) {
          warnings.push({
            id: `warn_organic_${mem.id}`,
            type: 'worldbuilding_conflict',
            severity: 'medium',
            issue: `Sub-Level Nine is an unpowered metallic containment bay; spontaneous wild vegetation contradicts station geology.`,
            relatedEntity: 'Sub-Level Nine Environment',
            suggestedResolution: `Specify that the cedar scent was an anomalous aerosol or sensory hallucination from the cylinder.`
          });
        }
      }
    }

    if (mem.type === 'event') {
      const factLower = mem.content.toLowerCase();
      if (factLower.includes('locked in the centrifuge') || factLower.includes('sub-level nine breach')) {
        if (textLower.includes('donald was never near the centrifuge') || textLower.includes('they slept through the solar flare')) {
          warnings.push({
            id: `warn_event_${mem.id}`,
            type: 'contradictory_event',
            severity: 'high',
            issue: `Contradicts prior chapter event: ${mem.content}`,
            relatedEntity: 'Timeline Anomaly',
            sourceChapterTitle: mem.sourceChapterTitle,
            suggestedResolution: `Align the timeline with the lockdown log from Chapter 1.`
          });
        }
      }
    }
  }

  return warnings;
}

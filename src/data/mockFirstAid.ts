// Mock data for first aid guides
import { FirstAidGuide } from '../types';

export const mockFirstAidGuides: FirstAidGuide[] = [
  {
    id: '1',
    topic: 'Bleeding Control',
    steps: [
      'Apply direct pressure to the wound with a clean cloth',
      'Elevate the injured area above heart level if possible',
      'If bleeding continues, apply additional pressure',
      'Do not remove objects embedded in deep wounds',
      'Seek immediate medical attention for severe bleeding'
    ],
    category: 'bleeding',
    urgency: 'high',
    language: 'en'
  },
  {
    id: '2', 
    topic: 'CPR Basics',
    steps: [
      'Check if person is responsive - tap shoulders and shout',
      'Call for emergency help immediately',
      'Place hands on center of chest, between nipples',
      'Push hard and fast at least 2 inches deep',
      'Allow complete chest recoil between compressions',
      'Compress at least 100-120 times per minute'
    ],
    category: 'breathing',
    urgency: 'emergency',
    language: 'en'
  },
  {
    id: '3',
    topic: 'Burn Treatment',
    steps: [
      'Cool the burn with cool (not cold) water for 10-20 minutes',
      'Remove rings or tight items before swelling begins',
      'Do not break blisters if they form',
      'Apply loose bandage to protect the area',
      'Take over-the-counter pain medication if needed',
      'Seek medical care for severe burns'
    ],
    category: 'burns',
    urgency: 'medium',
    language: 'en'
  },
  {
    id: '4',
    topic: 'Choking Response',
    steps: [
      'Ask "Are you choking?" - if they can speak, encourage coughing',
      'If unable to speak, stand behind the person',
      'Place arms around waist, hands below ribcage',
      'Give 5 sharp upward thrusts (Heimlich maneuver)',
      'Check mouth and remove visible objects with finger sweep',
      'Repeat until object is expelled or person becomes unconscious'
    ],
    category: 'breathing',
    urgency: 'emergency',
    language: 'en'
  },
  {
    id: '5',
    topic: 'Shock Treatment',
    steps: [
      'Have person lie down and elevate legs 8-12 inches',
      'Do not elevate head or move if spinal injury suspected',
      'Keep person warm with blanket or coat',
      'Loosen tight clothing',
      'Do not give food or water',
      'Monitor breathing and pulse until help arrives'
    ],
    category: 'shock',
    urgency: 'high',
    language: 'en'
  }
];
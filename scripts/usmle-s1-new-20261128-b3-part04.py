# Batch 3. Nervous pathway from OpenStax 12.3.

add(
    domain="behavioral-nervous", subject="physiology", topic="graded-potential-threshold",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="A sensory receptor produces a graded potential whose size depends on stimulus strength. If it reaches threshold, an action potential starts at the initial segment.",
    forbid=["threshold", "graded"],
    vignette=(
        "A 20-year-old man puts his hand in shower water. Temperature of the water is hot. His pulse is 80/min, "
        "respirations are 16/min, and blood pressure is 118/72 mm Hg. Receptors in the skin change their membrane "
        "voltage in proportion to how hot the water is. Only when that change is large enough does a traveling "
        "signal start on the axon."
    ),
    stem="Which of the following must the receptor voltage reach?",
    options=[
        "The point at which an impulse starts on the axon",
        "The synapse where acetylcholine meets the muscle",
        "The precentral gyrus, before any receptor has fired",
        "A second messenger made from ATP inside a liver cell",
        "The yellowish body that later secretes progesterone",
    ],
    key=0,
    whys=[
        "A thermoreceptor makes a graded potential whose size depends on stimulus strength. If that potential reaches threshold, an action potential starts at the initial segment. His hot water is that stimulus.",
        "Acetylcholine at the neuromuscular junction is the last step, after a lower motor neuron has fired.",
        "The precentral gyrus sends the motor command after the cortex has integrated the sensation.",
        "Cyclic AMP is a hormone second messenger. It is not the sensory threshold.",
        "The yellowish body left after ovulation is ovarian. It is not part of this sensory step.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="thalamus-sensory-relay",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The sensory neuron synapses in the spinal cord, the signal goes to the thalamus, and the thalamus relays it to the cerebral cortex, where conscious perception begins.",
    forbid=["thalamus", "cortex"],
    vignette=(
        "A 24-year-old woman feels the temperature of water on her hand. Temperature is 36.6°C, pulse is "
        "74/min, respirations are 14/min, and blood pressure is 112/70 mm Hg. The signal has entered the spinal "
        "cord and has been passed to a relay deep in the brain. She is not yet aware of the temperature. "
        "Awareness begins only after the next station, the outer gray matter."
    ),
    stem="Which of the following is the relay before awareness?",
    options=[
        "The deep relay that passes sensation on to the outer gray layer",
        "The muscle end plate, where acetylcholine is released",
        "The descending motor cell in the frontal gyrus",
        "The lower motor neuron leaving the cord in a nerve",
        "The receptor itself, which only makes a local voltage",
    ],
    key=0,
    whys=[
        "After a spinal synapse, the sensory path reaches the thalamus, which relays it to the cerebral cortex. Conscious perception begins in the cortex. She is not yet aware, so the signal is at the thalamic relay.",
        "The neuromuscular junction is the motor ending on muscle, after a command has been sent.",
        "The upper motor neuron in the precentral gyrus carries the motor command down the cord.",
        "The lower motor neuron leaves the cord to the muscle. It is not the sensory relay.",
        "The receptor makes the graded potential. Awareness requires the cortex after the thalamic relay.",
    ],
)

add(
    domain="behavioral-nervous", subject="anatomy", topic="upper-motor-precentral",
    task="anatomy", difficulty=2, src="os-12-3", nutrition=False,
    fact="The upper motor neuron is in the precentral gyrus of the frontal cortex. Its axon descends to synapse on a lower motor neuron in the spinal gray matter.",
    forbid=["precentral", "upper motor"],
    vignette=(
        "A 55-year-old man decides to step out of a hot shower. Temperature is 36.6°C, pulse is 78/min, "
        "respirations are 16/min, and blood pressure is 130/80 mm Hg. The command starts in a strip of frontal "
        "cortex and the axon runs all the way down the spinal cord. It ends on a second neuron in the cord's "
        "gray matter."
    ),
    stem="Which of the following is the cell that starts this command?",
    options=[
        "A cell in the frontal lobe whose axon reaches the cord",
        "The skin receptor that sensed the water",
        "The thalamic cell that relayed temperature",
        "The cord cell whose axon leaves to the muscle",
        "The muscle fiber, which only receives acetylcholine",
    ],
    key=0,
    whys=[
        "The upper motor neuron sits in the precentral gyrus and sends its axon down to a lower motor neuron in the spinal gray matter. His decision to step out uses that descending cell.",
        "The thermoreceptor starts the sensory side, not the motor command.",
        "The thalamus relays sensation to the cortex. It does not send the motor axon down the cord.",
        "The lower motor neuron is the second cell, in the cord, whose axon leaves to the muscle.",
        "The muscle fiber contracts after acetylcholine. It does not start the command.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="acetylcholine-nmj",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="At the neuromuscular junction the lower motor neuron releases acetylcholine, producing an end-plate potential and then a muscle action potential, and the fiber contracts.",
    forbid=["acetylcholine", "end plate"],
    vignette=(
        "A 30-year-old woman flexes her elbow. Temperature is 36.6°C, pulse is 72/min, respirations are 14/min, "
        "and blood pressure is 116/72 mm Hg. The neuron that leaves the spinal cord ends on the muscle. A chemical "
        "is released there, the muscle membrane produces a large potential, and the fiber contracts."
    ),
    stem="Which of the following chemical is released onto the muscle?",
    options=[
        "The molecule freed where the nerve meets the fiber",
        "The second messenger made from ATP by a liver hormone",
        "Progesterone from the collapsed ovarian follicle",
        "Surfactant from the type II alveolar cell",
        "Collagen, the matrix protein missing in brittle bone",
    ],
    key=0,
    whys=[
        "The lower motor neuron releases acetylcholine at the neuromuscular junction. That causes an end-plate potential, then a muscle action potential, and the fiber contracts. She is flexing her elbow.",
        "Cyclic AMP is an intracellular hormone messenger, not the neuromuscular transmitter.",
        "Progesterone comes from the corpus luteum. It does not trigger muscle contraction.",
        "Surfactant lowers alveolar surface tension. It is not released at the nerve-muscle junction.",
        "Collagen is a structural protein. It is not the transmitter at the end plate.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="neurotransmitter-synapse",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="When an action potential reaches the synaptic end bulbs, neurotransmitter is released, diffuses across the synapse, and binds a receptor on the next cell, starting a new graded potential.",
    forbid=["neurotransmitter", "synapse"],
    vignette=(
        "A 19-year-old student traces one sensory cell. Temperature is 36.6°C, pulse is 70/min, respirations "
        "are 14/min, and blood pressure is 110/68 mm Hg. The traveling signal reaches the end bulbs, a chemical "
        "is released, and it crosses a narrow gap. The next cell's membrane voltage then changes locally."
    ),
    stem="Which of the following crosses the gap?",
    options=[
        "A chemical released from the synaptic end bulbs",
        "The action potential itself, jumping with no chemical",
        "Cyclic AMP produced from ATP inside the cleft",
        "A steroid hormone bound to a plasma carrier",
        "Calcium liberated from the bone matrix",
    ],
    key=0,
    whys=[
        "At the synaptic end bulbs the arriving action potential releases neurotransmitter. It diffuses across the synapse and binds a receptor, starting a graded potential in the next cell. His tracing is that step.",
        "The signal does not jump the gap as the action potential. A chemical carries it.",
        "Cyclic AMP is made inside a target cell in hormone signaling, not released into a neural cleft.",
        "Steroid carriers operate in blood. They are not the synaptic chemical.",
        "Bone calcium is in matrix. Synaptic signaling here is a released transmitter.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="conscious-perception-cortex",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="Conscious perception of the stimulus begins when the signal reaches the cerebral cortex, the outer gray matter.",
    forbid=["conscious", "perception"],
    vignette=(
        "A 33-year-old man becomes aware that the shower is too hot. Temperature is 36.6°C, pulse is 84/min, "
        "respirations are 16/min, and blood pressure is 124/76 mm Hg. The signal has already passed a deep relay. "
        "Awareness starts only when it reaches the outer layer of gray matter."
    ),
    stem="Which of the following is required before he is aware?",
    options=[
        "Arrival of the impulse in the outer gray layer of the brain",
        "Release of the nerve-muscle chemical onto the fiber",
        "A graded potential that stays below the starting level",
        "Contraction of the muscle before any sensory cell fires",
        "Conversion of the leftover follicle into a yellowish body",
    ],
    key=0,
    whys=[
        "Conscious perception begins in the cerebral cortex after the thalamus relays the signal. He becomes aware only when the signal reaches that outer gray matter.",
        "Acetylcholine at the muscle is the motor ending, after a decision, not the start of awareness.",
        "A graded potential below threshold does not even start an action potential.",
        "Muscle contraction is the response. Awareness of temperature comes from the sensory path to cortex.",
        "Luteinization makes the corpus luteum. It is unrelated to temperature awareness.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="lower-motor-muscle",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The lower motor neuron's axon leaves the spinal cord in a nerve and ends at the neuromuscular junction.",
    forbid=["lower motor"],
    vignette=(
        "A 40-year-old woman moves her hand away from hot water. Temperature is 36.6°C, pulse is 88/min, "
        "respirations are 18/min, and blood pressure is 126/78 mm Hg. A frontal-cortex axon has already synapsed "
        "in the cord. The next axon's cell body is in the cord's gray matter, and that axon leaves in a nerve."
    ),
    stem="Which of the following is the destination of the axon that leaves the cord?",
    options=[
        "The muscle, at the specialized nerve-muscle junction",
        "The deep sensory relay inside the brain",
        "The skin receptor that started the temperature signal",
        "The precentral gyrus, to begin the command",
        "The ovary, where a midcycle gonadotropin burst starts",
    ],
    key=0,
    whys=[
        "The lower motor neuron's axon leaves the cord in a nerve and ends on muscle at the neuromuscular junction. Her hand is moving after that cord cell has been excited.",
        "The thalamus is on the sensory path, before the cortex.",
        "The skin receptor is the start of sensation, not the target of the axon leaving the cord.",
        "The precentral gyrus holds the upper motor neuron, which has already synapsed in the cord.",
        "An LH burst is ovarian physiology, not the target of a spinal motor axon.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="integration-before-motor",
    task="mechanism", difficulty=3, src="os-12-3", nutrition=False,
    fact="After the cortex receives the sensation, it integrates it with other input, emotion, and memory, then sends a motor command from the precentral gyrus.",
    forbid=["integration", "memory"],
    vignette=(
        "A 22-year-old man feels cold water and also remembers he is late. Temperature is 36.6°C, pulse is "
        "90/min, respirations are 16/min, and blood pressure is 118/74 mm Hg. Several cortical areas combine the "
        "temperature with that memory before a movement is chosen. Only then does a command leave the frontal strip."
    ),
    stem="Which of the following happens before the motor command?",
    options=[
        "Higher areas join the sensation to other information",
        "The nerve-muscle chemical is released onto the fiber",
        "The lower motor neuron has already left the cord",
        "The muscle contracts and only then is the water sensed",
        "A steroid binds an intracellular receptor in the muscle",
    ],
    key=0,
    whys=[
        "The cortex integrates the stimulus with other sensations, emotion, and memory, then the precentral gyrus sends the motor command. He combines the cold water with being late before he moves.",
        "Acetylcholine at the muscle is after the command has traveled down the cord.",
        "The lower motor neuron fires after the upper motor neuron has synapsed on it.",
        "Sensing the water is the start of the path. Contraction is the end.",
        "Steroid receptors are not the step between sensation and a motor command.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="propagation-to-terminals",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The action potential propagates from the axon hillock to the axon terminals and into the synaptic end bulbs.",
    forbid=["hillock", "propagation"],
    vignette=(
        "A 28-year-old woman has a sensory axon that has just reached the voltage needed to fire. Temperature "
        "is 36.6°C, pulse is 72/min, respirations are 14/min, and blood pressure is 114/70 mm Hg. The traveling "
        "signal begins next to the cell body and runs to the far end of the axon, into the bulbs that will "
        "release a chemical."
    ),
    stem="Which of the following is the direction of that traveling signal?",
    options=[
        "From the start of the axon toward the releasing bulbs",
        "From the muscle back to the skin receptor",
        "From the cortex down a motor axon before any sensation",
        "Across the membrane as a hormone second messenger",
        "From the medulla of the ovary into a follicle",
    ],
    key=0,
    whys=[
        "Once threshold is reached, the action potential propagates from the axon hillock to the terminals and into the synaptic end bulbs. Her sensory axon has just started that trip.",
        "The sensory path does not run from muscle back to the receptor.",
        "A descending motor axon is a later, separate cell. This vignette is the sensory axon that just fired.",
        "A second messenger stays inside a hormone's target cell. It is not this traveling axonal signal.",
        "The ovarian medulla holds vessels. It is not an axon.",
    ],
)

add(
    domain="behavioral-nervous", subject="physiology", topic="sensation-integration-response",
    task="mechanism", difficulty=2, src="os-12-3", nutrition=False,
    fact="The major functions illustrated are sensation, integration, and response.",
    forbid=["integration"],
    vignette=(
        "A 18-year-old student maps one shower reflex. Temperature is 36.6°C, pulse is 76/min, respirations "
        "are 14/min, and blood pressure is 110/68 mm Hg. Skin receptors detect the water, the brain combines "
        "that information with other facts, and muscles then move the hand. Those are the three jobs in order."
    ),
    stem="Which of the following is the middle job?",
    options=[
        "Combining the sensory information before a movement is chosen",
        "Detecting the water temperature in the skin",
        "Contracting the muscle after acetylcholine is released",
        "Releasing progesterone from the corpus luteum",
        "Remodeling five to ten percent of the skeleton",
    ],
    key=0,
    whys=[
        "The sequence is sensation, then integration, then response. Combining the information in the cortex is the middle job. She mapped that order.",
        "Detection in the skin is sensation, the first job.",
        "Muscle contraction is the response, the last job.",
        "Progesterone secretion is ovarian, not this neural sequence.",
        "Bone remodeling is skeletal turnover, not the middle neural job.",
    ],
)

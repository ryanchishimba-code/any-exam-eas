# Batch 3. Bone from OpenStax 6.4.

add(
    domain="msk-skin", subject="histology", topic="cartilage-avascular",
    task="histology", difficulty=2, src="os-6-4", nutrition=False,
    fact="Cartilage is avascular. Nutrients and wastes move by diffusion, which is why damaged cartilage repairs poorly.",
    forbid=["avascular", "diffusion"],
    vignette=(
        "A 17-year-old boy who plays soccer tears a piece of the cartilage in his knee. Temperature is 36.6°C, "
        "pulse is 72/min, respirations are 14/min, and blood pressure is 118/70 mm Hg. The tissue has no blood "
        "vessels. Nutrients reach the cells only by moving through the matrix. The tear heals slowly."
    ),
    stem="Which of the following explains the slow healing?",
    options=[
        "It has no blood supply, so nutrients cross the ground substance",
        "Osteoblasts have already replaced the entire cartilage model",
        "The epiphyseal line has sealed and growth has stopped",
        "Compact bone cannot form without a cartilage template",
        "Five to ten percent of the skeleton is remodeled each year",
    ],
    key=0,
    whys=[
        "Cartilage has no blood vessels. Nutrients and wastes move by diffusion through the matrix, so damaged cartilage does not repair as readily as most tissues. His knee cartilage is that tissue.",
        "Endochondral bone replaces a cartilage model during development. His injury is a tear in existing cartilage.",
        "The epiphyseal line is the remnant after longitudinal growth stops. It does not explain a cartilage tear.",
        "Flat bones of the skull, face, and clavicle form by intramembranous ossification, without a cartilage model.",
        "Annual remodeling of 5 to 10 percent is adult bone turnover, not the reason cartilage heals slowly.",
    ],
)

add(
    domain="msk-skin", subject="anatomy", topic="intramembranous-skull",
    task="anatomy", difficulty=2, src="os-6-4", nutrition=False,
    fact="Intramembranous ossification forms bone directly from mesenchyme. Flat bones of the face, most cranial bones, and the clavicles form this way.",
    forbid=["intramembranous", "clavicle"],
    vignette=(
        "A newborn's skull and collarbones are not fully hardened, which lets the head and shoulders change "
        "shape in the birth canal. Temperature is 36.8°C, pulse is 140/min, respirations are 40/min, and blood "
        "pressure is not measured. These bones formed directly from sheets of embryonic connective tissue, not "
        "by replacing a cartilage model."
    ),
    stem="Which of the following bones form by that direct path?",
    options=[
        "Most cranial bones, the facial bones, and the collarbones",
        "The long bones of the limbs and the skull base",
        "Only the epiphyseal plates of growing long bones",
        "Only articular cartilage that remains at joint surfaces",
        "The medullary cavity, which is never bone",
    ],
    key=0,
    whys=[
        "Intramembranous ossification builds bone directly from mesenchyme. Most cranial bones, the flat facial bones, and the clavicles form this way. The newborn's skull and collarbones are those bones.",
        "Long bones and the base of the skull form by endochondral ossification, replacing hyaline cartilage.",
        "The epiphyseal plate is hyaline cartilage that lengthens a long bone. It is not the intramembranous path.",
        "Articular cartilage remains at joint surfaces. It is not bone formed from mesenchyme.",
        "The medullary cavity is the marrow space inside a long bone, formed as cartilage is replaced.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="endochondral-replaces-cartilage",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="In endochondral ossification, bone replaces hyaline cartilage. Cartilage does not turn into bone. Long bones and the skull base use this path.",
    forbid=["endochondral", "hyaline"],
    vignette=(
        "A fetal femur at eight weeks is a cartilage model. Temperature is not measured. Blood vessels later "
        "enter the model, the central cells die as the matrix hardens, and bone is laid down in their place. "
        "The cartilage does not itself become bone."
    ),
    stem="Which of the following describes this replacement?",
    options=[
        "Bone is laid down where the cartilage model is removed",
        "The cartilage cells turn directly into osteocytes",
        "The bone forms from mesenchyme with no cartilage model",
        "Growth in width stops as soon as length stops",
        "The entire model remains cartilage in the adult",
    ],
    key=0,
    whys=[
        "Endochondral ossification uses hyaline cartilage as a template that is replaced by bone. Cartilage does not become bone. The fetal femur follows that path.",
        "Chondrocytes die when the matrix calcifies and nutrients cannot reach them. They do not become osteocytes.",
        "Formation from mesenchyme without cartilage is intramembranous ossification, used by skull, face, and clavicle.",
        "Appositional growth in diameter can continue after longitudinal growth stops.",
        "In the adult, cartilage remains at the joint surface and, until growth ends, at the epiphyseal plate. The shaft is bone.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="epiphyseal-plate-length",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="The epiphyseal plate lengthens bone. Cartilage forms on the epiphyseal side. Cartilage is ossified on the diaphyseal side. When proliferation stops, the plate becomes the epiphyseal line.",
    forbid=["epiphyseal", "diaphysis"],
    vignette=(
        "A 12-year-old boy is growing taller. Temperature is 36.6°C, pulse is 80/min, respirations are 16/min, "
        "and blood pressure is 108/66 mm Hg. In each long bone a cartilage plate adds new cartilage toward the "
        "end of the bone and bone replaces cartilage toward the shaft. When the cartilage cells stop dividing, "
        "only a line remains."
    ),
    stem="Which of the following lengthens the bone?",
    options=[
        "New cartilage on the end side and bone added on the shaft side",
        "Bone added only under the periosteum, increasing width",
        "Osteoclasts widening the marrow cavity with no new bone",
        "Direct formation from mesenchyme, as in the clavicle",
        "A cartilage model that never receives blood vessels",
    ],
    key=0,
    whys=[
        "The epiphyseal plate makes cartilage on the epiphyseal side and ossifies it on the diaphyseal side, so the shaft lengthens. When chondrocytes stop proliferating, the plate becomes the epiphyseal line. He is still growing.",
        "Bone under the periosteum with resorption inside is appositional growth in diameter, not length.",
        "Osteoclasts resorb the medullary lining during modeling. Length requires the plate.",
        "The clavicle forms by intramembranous ossification. Long-bone length uses the growth plate.",
        "Endochondral growth requires vessels that bring osteoblasts into the calcified zone.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="appositional-growth",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="Appositional growth increases diameter. Osteoclasts resorb bone lining the medullary cavity. Osteoblasts add bone under the periosteum. The marrow cavity widens too. This can continue after length growth stops.",
    forbid=["appositional", "diameter"],
    vignette=(
        "A 25-year-old man has finished growing taller, but his long-bone shafts are still adding width. "
        "Temperature is 36.6°C, pulse is 68/min, respirations are 14/min, and blood pressure is 122/74 mm Hg. "
        "Cells remove bone along the marrow cavity while other cells add bone just under the outer membrane. "
        "The marrow space gets wider as the shaft does."
    ),
    stem="Which of the following is this growth in width?",
    options=[
        "Removal along the marrow space and new bone under the outer covering",
        "Cartilage added at the growth plate after it has already sealed",
        "Replacement of a cartilage model in a fetal long bone",
        "Formation of the clavicle directly from mesenchyme",
        "Five to ten percent turnover on the same bone surface",
    ],
    key=0,
    whys=[
        "Appositional growth widens the shaft: osteoclasts resorb the medullary lining and osteoblasts add bone under the periosteum, so the cavity widens too. It can continue after length growth stops. He has finished growing taller.",
        "A sealed plate is an epiphyseal line and no longer adds length. Width is a different process.",
        "Replacing a fetal cartilage model is endochondral ossification, not adult widening.",
        "The clavicle's direct path is intramembranous ossification in development.",
        "Remodeling replaces bone on the same surface. Modeling during growth deposits and resorbs on different surfaces.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="remodeling-same-surface",
    task="mechanism", difficulty=2, src="os-6-4", nutrition=False,
    fact="Remodeling resorbs old or damaged bone and deposits new bone on the same surface. Even without injury, about 5 to 10 percent of the skeleton is remodeled each year.",
    forbid=["remodel", "percent"],
    vignette=(
        "A 40-year-old woman who runs has a small region of worn bone. Temperature is 36.6°C, pulse is 70/min, "
        "respirations are 14/min, and blood pressure is 118/72 mm Hg. Cells remove the worn matrix and other "
        "cells lay new matrix on that same surface. Even without injury, a few percent of the skeleton is "
        "renewed this way each year."
    ),
    stem="Which of the following is this replacement on one surface?",
    options=[
        "Old bone is removed and new bone is laid on the same face",
        "Bone is removed inside and added outside to widen the shaft",
        "Cartilage at the growth plate is replaced to add length",
        "A fetal membrane becomes bone with no cartilage step",
        "Chondrocytes in the reserve zone secure the plate",
    ],
    key=0,
    whys=[
        "Remodeling resorbs old or damaged bone and deposits new bone on the same surface. About 5 to 10 percent of the skeleton turns over each year even without injury. Her worn region is being replaced that way.",
        "Resorption inside and deposition outside is modeling, which changes shape and diameter during growth.",
        "Growth-plate replacement lengthens an immature bone. She is an adult runner.",
        "Membrane bone is intramembranous ossification.",
        "The reserve zone anchors the epiphyseal plate. Its chondrocytes do not participate in growth.",
    ],
)

add(
    domain="msk-skin", subject="pathology", topic="osteogenesis-imperfecta-collagen",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="Osteogenesis imperfecta is a genetic defect in collagen production. Bones are fragile. Severe forms cause many fractures, deformity, and short stature. Blue sclera, brittle teeth, and hearing loss can occur. There is no cure.",
    forbid=["collagen", "imperfecta"],
    vignette=(
        "A 6-year-old boy has had many fractures from minor bumps. Temperature is 36.6°C, pulse is 90/min, "
        "respirations are 18/min, and blood pressure is 96/60 mm Hg. His long bones bow, he is short, his sclerae "
        "look blue, and his teeth crack. The matrix protein that gives bone its tensile strength is not made "
        "normally. There is no cure."
    ),
    stem="Which of the following protein is defective?",
    options=[
        "The fiber other tissues need for toughness",
        "The hormone that stores glucose as liver glycogen",
        "The surfactant that keeps alveoli from collapsing",
        "The catalyst that converts ATP into cyclic AMP",
        "The plasma carrier that transports cortisol",
    ],
    key=0,
    whys=[
        "Osteogenesis imperfecta is a genetic failure of collagen production. Collagen is a critical part of bone matrix, so bones break easily. Blue sclera, brittle teeth, and hearing loss fit because collagen is widespread. He has that picture, and there is no cure.",
        "Insulin stores glucose. It is not the matrix protein of brittle-bone disease.",
        "Surfactant is secreted by type II alveolar cells. It is not a bone-matrix protein.",
        "Adenylyl cyclase makes cyclic AMP for water-soluble hormones. It is not the defective bone protein.",
        "Cortisol's transport protein extends half-life. It is not the matrix defect.",
    ],
)

add(
    domain="msk-skin", subject="histology", topic="osteoblast-to-osteocyte",
    task="histology", difficulty=2, src="os-6-4", nutrition=False,
    fact="In intramembranous ossification, osteoblasts secrete osteoid, which calcifies and traps them. Trapped osteoblasts become osteocytes.",
    forbid=["osteocyte", "osteoid"],
    vignette=(
        "A fetal clavicle is forming. Temperature is not measured. Cells in an ossification center secrete an "
        "uncalcified matrix. Mineral is deposited within a few days and the cells are trapped. The trapped cells "
        "then change identity."
    ),
    stem="Which of the following do the trapped cells become?",
    options=[
        "Mature bone cells enclosed in the hardened matrix",
        "Cartilage cells that keep dividing at the growth plate",
        "Cells that resorb the lining of the marrow cavity",
        "The flat support cells of a resting ovarian follicle",
        "Red marrow, formed from crowded blood vessels",
    ],
    key=0,
    whys=[
        "Osteoblasts secrete osteoid. When it calcifies they are trapped and become osteocytes. The fetal clavicle is forming by that intramembranous sequence.",
        "Chondrocytes divide in the proliferative zone of the growth plate. They are not trapped osteoblasts.",
        "Osteoclasts resorb bone along the medullary cavity during widening.",
        "Flat granulosa cells surround a primordial follicle. They are not bone cells.",
        "Crowded vessels condense into red marrow. That is a separate step, not the fate of the trapped cells.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="reserve-zone-no-growth",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="The reserve zone is closest to the epiphysis. Its small chondrocytes do not participate in growth. They secure the plate to the epiphysis. The proliferative zone makes new chondrocytes by mitosis.",
    forbid=["reserve zone", "proliferative"],
    vignette=(
        "A 10-year-old girl has an open growth plate. Temperature is 36.6°C, pulse is 82/min, respirations are "
        "16/min, and blood pressure is 100/62 mm Hg. The layer of the plate nearest the end of the bone holds "
        "small cartilage cells that do not divide to lengthen the bone. They anchor the plate to the end. The "
        "next layer toward the shaft is the one that divides."
    ),
    stem="Which of the following is the job of the layer nearest the end?",
    options=[
        "It anchors the plate and its cells do not lengthen the bone",
        "It produces new cartilage cells by cell division",
        "It is where capillaries and osteoblasts lay bone",
        "It adds width by depositing bone under the periosteum",
        "It is the remnant line after growth has finished",
    ],
    key=0,
    whys=[
        "The reserve zone, closest to the epiphysis, has small chondrocytes that do not participate in growth. They secure the plate to the epiphysis. The proliferative zone, next toward the shaft, divides. Her open plate has that arrangement.",
        "Mitosis of new chondrocytes is the proliferative zone, not the reserve zone.",
        "Capillaries and osteoblasts invade the zone of calcified matrix, nearest the diaphysis.",
        "Bone under the periosteum widens the shaft. It is not a zone of the growth plate.",
        "The epiphyseal line remains after the plate closes. Her plate is still open.",
    ],
)

add(
    domain="msk-skin", subject="physiology", topic="primary-ossification-center",
    task="mechanism", difficulty=3, src="os-6-4", nutrition=False,
    fact="Capillaries penetrate the cartilage, the perichondrium becomes periosteum, a periosteal collar forms, and the primary ossification center appears deep to that collar. This is underway by the second or third fetal month.",
    forbid=["primary ossification", "periosteal collar"],
    vignette=(
        "A fetal long bone in the third month has a bony cuff around the shaft. Temperature is not measured. "
        "Vessels have entered the cartilage, the covering membrane now makes bone, and the first center of bone "
        "formation sits deep to the cuff. The ends of the model are still cartilage."
    ),
    stem="Which of the following is the first center of bone formation in the shaft?",
    options=[
        "The center deep to the bony cuff around the shaft",
        "A center in each end, appearing only after birth",
        "The facial bones forming directly from mesenchyme",
        "The growth plate after it has become a line",
        "Articular cartilage that never ossifies",
    ],
    key=0,
    whys=[
        "The primary ossification center forms deep to the periosteal collar after vessels enter and the perichondrium becomes periosteum. That is underway by the second or third fetal month. The ends are still growing as cartilage.",
        "Secondary ossification centers form in the epiphyses after birth.",
        "Facial bones use intramembranous ossification, not a cartilage model with a collar.",
        "The epiphyseal line is the closed plate of a mature bone.",
        "Articular cartilage remains at the joint. It is not the shaft center.",
    ],
)

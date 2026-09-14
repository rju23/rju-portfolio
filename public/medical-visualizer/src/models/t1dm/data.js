// Content for the Type 1 Diabetes autoimmune β-cell destruction model.
// Kept separate from the scene/animation logic so the medical text can
// be reviewed and edited independently.

export const MAJOR_AUTOANTIGENS = [
  {
    id: 'insulin',
    name: 'Insulin / Proinsulin',
    what: 'The hormone β-cells produce to lower blood glucose, and its precursor proinsulin.',
    why: 'One of the earliest autoantigens targeted in the autoimmune process, particularly in young children.',
    marker: 'Insulin autoantibodies (IAA) are used as an early biomarker, not as a cause of β-cell injury.',
    color: '#7fd88f'
  },
  {
    id: 'gad65',
    name: 'GAD65',
    what: 'Glutamic acid decarboxylase 65, an enzyme involved in GABA synthesis, expressed in β-cells.',
    why: 'A major target of islet autoimmunity and one of the most extensively studied autoantigens.',
    marker: 'GAD65 autoantibodies (GADA) are a commonly tested, often persistent, biomarker.',
    color: '#c98fff'
  },
  {
    id: 'ia2',
    name: 'IA-2',
    what: 'A protein tyrosine phosphatase-like molecule found in insulin secretory granules.',
    why: 'Autoimmunity against IA-2 is associated with higher risk of progression to clinical T1DM.',
    marker: 'IA-2 autoantibodies (IA-2A) are part of the standard autoantibody panel.',
    color: '#ffb266'
  },
  {
    id: 'znt8',
    name: 'ZnT8',
    what: 'A zinc transporter that helps concentrate zinc for insulin crystallization in secretory granules.',
    why: 'A more recently characterized autoantigen that improves detection when combined with the others.',
    marker: 'ZnT8 autoantibodies (ZnT8A) add sensitivity to autoantibody screening panels.',
    color: '#66ccff'
  }
]

export const OTHER_AUTOANTIGENS = [
  'Chromogranin A',
  'IAPP / amylin',
  'IGRP',
  'Phogrin / PTPRN2',
  'ICA69',
  'Other β-cell-derived proteins and peptides'
]

// Explanations keyed by what the user can actually click in the scene:
// a β-cell, a CD8+ T cell, a B cell, a plasma cell, or an antibody
// (antibody bodies are completed at runtime with their target antigen).
export const NODE_EXPLANATIONS = {
  'beta-cell': {
    title: 'β-cell',
    body: 'Pancreatic β-cells, found in the islets of Langerhans, synthesize and secrete insulin in response to blood glucose. They contain many intracellular and membrane proteins — the four most clinically important autoantigens are insulin, GAD65, IA-2 and ZnT8, but β-cells express many other proteins that can potentially be targeted by the immune system.'
  },
  tcell: {
    title: 'CD8+ cytotoxic T cell',
    body: 'A β-cell protein is processed into a short peptide fragment and displayed on MHC class I on the β-cell surface. The T-cell receptor (TCR) on a CD8+ T cell recognizes this peptide-MHC I complex, and the T cell then delivers a cytotoxic attack. CD8+ T cells are considered the major direct effector of β-cell destruction in T1DM.'
  },
  bcell: {
    title: 'B cell',
    body: 'B cells recognize β-cell antigen directly through their B-cell receptor (BCR), without needing it processed first. With help from CD4+ helper T cells, an activated B cell can differentiate into a plasma cell. B cells do not directly kill β-cells.'
  },
  'plasma-cell': {
    title: 'Plasma cell',
    body: 'A plasma cell is the differentiated, antibody-secreting form of an activated B cell. It produces the autoantibodies seen in T1DM (e.g. against insulin, GAD65, IA-2, ZnT8) but does not itself attack β-cells.'
  },
  antibody: {
    title: 'Autoantibody',
    body: 'Autoantibodies circulate and bind their target antigen, but they are biomarkers of the autoimmune process rather than the main mechanism of β-cell destruction — that role belongs to CD8+ T cells.'
  },
  tolerance: {
    title: 'Loss of self-tolerance',
    body: 'Normally, the immune system recognizes β-cell proteins as "self" and does not mount a destructive response. In T1DM, this tolerance breaks down — genetic susceptibility together with environmental factors may contribute, but no single trigger accounts for all cases.'
  },
  'insulin-deficiency': {
    title: 'Insulin output',
    body: 'Insulin output tracks surviving β-cell mass directly. As autoimmune destruction reduces the number of functional β-cells, endogenous insulin production falls — in established T1DM it becomes absolute.'
  },
  hyperglycaemia: {
    title: 'Hyperglycaemia',
    body: 'Without insulin, tissues cannot take up glucose normally and the liver continues producing glucose unchecked, so blood glucose rises. This is a downstream consequence of insulin deficiency, not part of the autoimmune attack itself.'
  },
  lipolysis: {
    title: 'Lipolysis',
    body: 'Insulin normally suppresses fat breakdown. Absolute insulin deficiency removes this brake, so adipose tissue releases free fatty acids into the circulation.'
  },
  ketogenesis: {
    title: 'Ketogenesis',
    body: 'The liver converts the surplus of free fatty acids into ketone bodies, which accumulate when production outpaces use.'
  },
  dka: {
    title: 'Diabetic ketoacidosis (DKA)',
    body: 'Accumulating ketones and hyperglycaemia together produce the metabolic acidosis, dehydration and electrolyte disturbance of DKA. DKA is a downstream metabolic consequence of absolute insulin deficiency, not the process that initiates T1DM.'
  }
}

// Study Mode: an ordered walkthrough. Each step describes the scripted
// cellular scenario the scene should display (see scene.js buildStepScenario)
// while the simulation is paused.
export const STUDY_STEPS = [
  {
    id: 'antigens',
    title: 'β-cell autoantigens',
    text: 'β-cells express many proteins. Insulin, GAD65, IA-2 and ZnT8 are the four major clinically recognized autoantigens, alongside other β-cell proteins that can potentially be targeted. Click a β-cell to see them.'
  },
  {
    id: 'tolerance',
    title: 'Loss of self-tolerance',
    text: 'T1DM begins with a breakdown of immune tolerance to β-cell proteins. Genetic susceptibility plus environmental factors may contribute — no single trigger explains all cases.'
  },
  {
    id: 'presentation',
    title: 'Antigen presentation',
    text: 'A β-cell peptide is displayed on MHC I at the cell surface. A CD8+ T cell approaches but has not yet made contact.'
  },
  {
    id: 'tcell',
    title: 'CD8+ T-cell-mediated destruction',
    text: 'The T-cell receptor recognizes the peptide-MHC I complex (the glowing contact point). The CD8+ T cell then delivers a cytotoxic attack, and the β-cell is damaged and removed.'
  },
  {
    id: 'bcell',
    title: 'B-cell activation and autoantibodies',
    text: 'A B cell recognizes β-cell antigen via its BCR, migrates to the plasma-cell zone, and transforms into a plasma cell that begins secreting autoantibodies. Note: no damage is done to the β-cell in this branch.',
  },
  {
    id: 'loss',
    title: 'Progressive β-cell loss',
    text: 'Over time, repeated CD8+ T-cell attacks reduce the number of surviving β-cells in the islet, while antibody evidence of the autoimmune response accumulates in the background.'
  },
  {
    id: 'deficiency',
    title: 'Absolute insulin deficiency',
    text: 'Once enough β-cell mass is lost, endogenous insulin secretion becomes insufficient and, eventually, absent. Watch the insulin meter fall as fewer β-cells survive.'
  },
  {
    id: 'metabolic',
    title: 'Hyperglycaemia and metabolic consequences',
    text: 'Absolute insulin deficiency raises blood glucose and unleashes lipolysis; the resulting free fatty acids are converted to ketones, which can accumulate as DKA (downstream — see the panel below the meter).'
  }
]

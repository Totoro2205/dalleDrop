# a model that can read multiple images in a character!

 import math
from typing import Any, Dict
 import argparseimport math
 import torch
 import torch.nn as nn

 from .cnn import CBB, IMAGE_SIZE

 WINDOW_WIDTH = 28
 WINDOW_STRIDE = 28

 class LineCNNSimple(nn.module):
     def __init__(
         self,
         data_config
     )
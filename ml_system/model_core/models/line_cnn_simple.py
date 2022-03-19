# a model that can read multiple images in a character!

from typing import Any, Dict
import argparse 
import math
 
import torch
import torch.nn as nn

from .cnn import CNN, IMAGE_SIZE

WINDOW_WIDTH = 28
WINDOW_STRIDE = 28

class LineCNNSimple(nn.module):
    def __init__(
         self,
         data_config: Dict[str, Any],
         args: argparse.Namespace = None,
    ) -> None:

    super().__init__()
    self.args = vars(args) if args is not None else {}

    self.WW = self.args.get('window_width', WINDOW_WIDTH)
    self,WS = self.args.get('window_stride', WINDOW_STRIDE)
    self.limit_output_length = self.args.get('limit_output_length', False)

    self.num_classes = len(data_config['mapping'])
    self.output_length = data_config['output_dims'][0]
    self.cnn = CNN(data_config=data_config, args=args)

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        B, _C, H, W = x.shape
        assert H == IMAGE_SIZE

        S = math.floor((W - self.WW) / self.WS + 1)

        activations = torch.zeros((b, self.num_classes, S)).type_as(x)
        for s in range(S):
            start_w = self.WS * s 
            end_w = start_w + self.WW
            window = x[:, :, start_w:end_w]
            activations[:, :, s] = self.cnn(window)

        if self.limit_output_length:
            activations = activations[:, :, : self.output_length]

        return activations

    @staticmethod
    def add_to_argparse(parser):
        CNN.add_to_argparse(parser)
        parser.add_argument('--window_width', type=int, default=WINDOW_WIDTH, help= 'width of the window that will slide over the input image')
        parser.add_argument('--window_stride', type = int, default=WINDOW_STRIDE, help='Stride of that will slide over the input image')
        parser.add_argument('--limit_output_length', action='store_true', default=False)
        return parser



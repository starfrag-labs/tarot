import { Test, TestingModule } from '@nestjs/testing';
import { TarotController } from './tarot.controller';
import { TarotService } from 'src/services/tarot.service';

describe('TarotController', () => {
  let controller: TarotController;

  const mockTarotService = {
    readTarot: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotController],
      providers: [
        {
          provide: TarotService,
          useValue: mockTarotService,
        },
      ],
    }).compile();

    controller = module.get<TarotController>(TarotController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('readTarot', () => {
    it('should return tarot message', async () => {
      const mockResponse = {
        title: 'The Fool',
        titleKR: '바보',
        keywords: ['new beginning', 'adventure', 'innocence', 'spontaneity'],
        advice: 'Today is a great day for new beginnings!',
      };

      mockTarotService.readTarot.mockResolvedValue(mockResponse);

      const result = await controller.readTarot();

      expect(mockTarotService.readTarot).toHaveBeenCalledWith();
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
    });
  });
});

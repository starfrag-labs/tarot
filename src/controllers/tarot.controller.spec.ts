import { Test, TestingModule } from '@nestjs/testing';
import { TarotController } from './tarot.controller';
import { TodayTarotService } from 'src/services/tarot/today_tarot.service';
import { RomanceTarotService } from 'src/services/tarot/romance_tarot.service';
import { MonthlyStudyTarotService } from 'src/services/tarot/monthly_study_tarot.service';

describe('TarotController', () => {
  let controller: TarotController;
  let todayTarotService: TodayTarotService;
  let romanceTarotService: RomanceTarotService;
  let monthlyStudyTarotService: MonthlyStudyTarotService;

  const mockTodayTarotService = {
    readTarot: jest.fn(),
  };

  const mockRomanceTarotService = {
    readTarot: jest.fn(),
  };

  const mockMonthlyStudyTarotService = {
    readTarot: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TarotController],
      providers: [
        {
          provide: TodayTarotService,
          useValue: mockTodayTarotService,
        },
        {
          provide: RomanceTarotService,
          useValue: mockRomanceTarotService,
        },
        {
          provide: MonthlyStudyTarotService,
          useValue: mockMonthlyStudyTarotService,
        },
      ],
    })
      .overridePipe('ZodValidationPipe')
      .useValue({
        transform: (value: unknown) => value,
      })
      .compile();

    controller = module.get<TarotController>(TarotController);
    todayTarotService = module.get<TodayTarotService>(TodayTarotService);
    romanceTarotService = module.get<RomanceTarotService>(RomanceTarotService);
    monthlyStudyTarotService = module.get<MonthlyStudyTarotService>(
      MonthlyStudyTarotService,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTodayTarotMessage', () => {
    it('should return today tarot message', async () => {
      const mockRequest = {
        userUuid: 'test-uuid',
        cards: [{ name: 'The Fool', direction: 'upright' }],
      };

      const mockResponse = {
        description: 'Today is a great day!',
      };

      mockTodayTarotService.readTarot.mockResolvedValue(mockResponse);

      const result = await controller.getTodayTarotMessage(mockRequest);

      expect(todayTarotService.readTarot).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
    });
  });

  describe('getRomanceTarotMessage', () => {
    it('should return romance tarot message', async () => {
      const mockRequest = {
        userUuid: 'test-uuid',
        cards: [{ name: 'The Lovers', direction: 'upright' }],
      };

      const mockResponse = {
        description: 'Love is in the air!',
      };

      mockRomanceTarotService.readTarot.mockResolvedValue(mockResponse);

      const result = await controller.getRomanceTarotMessage(mockRequest);

      expect(romanceTarotService.readTarot).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
    });
  });

  describe('getMonthlyStudyTarotMessage', () => {
    it('should return monthly study tarot message', async () => {
      const mockRequest = {
        userUuid: 'test-uuid',
        currentStateCard: { name: 'The Magician', direction: 'upright' },
        obstacleCard: { name: 'The Tower', direction: 'reversed' },
        adviceCard: { name: 'The Star', direction: 'upright' },
      };

      const mockResponse = {
        currentState: 'You are in a good place',
        obstacle: 'Watch out for challenges',
        advice: 'Keep moving forward',
        summary: 'Overall positive outlook',
      };

      mockMonthlyStudyTarotService.readTarot.mockResolvedValue(mockResponse);

      const result = await controller.getMonthlyStudyTarotMessage(mockRequest);

      expect(monthlyStudyTarotService.readTarot).toHaveBeenCalledWith(
        mockRequest,
      );
      expect(result).toEqual({
        message: 'success',
        data: mockResponse,
      });
    });
  });
});

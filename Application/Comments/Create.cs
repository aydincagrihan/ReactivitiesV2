using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System.Threading;

namespace Application.Comments
{
    public class Create
    {

        public class Command : IRequest<Result<CommentsDto>>
        {
            public string Body { get; set; }
            public Guid ActivityId { get; set; }

        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command, Result<CommentsDto>>
        {
            private readonly IMapper _mapper;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
                _mapper = mapper;
            }

            public async Task<Result<CommentsDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.ActivityId);

                if (activity == null) return null;

                var user = await _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = request.Body
                };

                activity.Comments.Add(comment);
                var success = await _context.SaveChangesAsync() > 0;
                if (success) return Result<CommentsDto>.Success(_mapper.Map<CommentsDto>(comment));
                return Result<CommentsDto>.Failure("Failed to add comment to activity");
            }
        }
    }
}


